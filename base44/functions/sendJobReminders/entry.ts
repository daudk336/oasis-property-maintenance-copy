import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Reject direct calls from non-admin users; scheduled runs pass through
    let user = null;
    try {
      user = await base44.auth.me();
    } catch (_) {
      // no user context (scheduled automation)
    }
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // "Tomorrow" in Brisbane time
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Brisbane' }));
    now.setDate(now.getDate() + 1);
    const tomorrow = now.toISOString().slice(0, 10);

    const jobs = await base44.asServiceRole.entities.Job.filter({ date: tomorrow, status: 'scheduled' });
    if (jobs.length === 0) {
      return Response.json({ sent: 0, date: tomorrow, message: 'No jobs scheduled for tomorrow' });
    }

    const clients = await base44.asServiceRole.entities.Client.list('name', 500);
    const results = [];

    for (const job of jobs) {
      const client = clients.find((c) => c.name.toLowerCase() === (job.client_name || '').toLowerCase());
      const email = client?.email;
      if (!email) {
        results.push({ job: job.client_name, status: 'skipped', reason: 'no email on file' });
        continue;
      }

      const subject = `Reminder: ${job.service} tomorrow (${tomorrow})`;

      // Skip if we already sent this exact reminder
      const existing = await base44.asServiceRole.entities.Message.filter({ recipient: email, subject });
      if (existing.length > 0) {
        results.push({ job: job.client_name, status: 'skipped', reason: 'already sent' });
        continue;
      }

      const firstName = (job.client_name || 'there').split(' ')[0];
      const timeInfo = job.time_slot ? ` between ${job.time_slot}` : '';
      const addressInfo = job.address ? ` at ${[job.address, job.suburb].filter(Boolean).join(', ')}` : '';
      const body = `Hi ${firstName},

Just a friendly reminder that FreshCut Property Services is scheduled to complete your ${job.service} tomorrow${timeInfo}${addressInfo}.

Please make sure gates are unlocked and pets are secured.

If you need to reschedule, give us a call on 0400 000 000.

See you tomorrow!
FreshCut Property Services`;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject,
        body,
        from_name: 'FreshCut Property Services',
      });

      await base44.asServiceRole.entities.Message.create({
        client_name: job.client_name,
        channel: 'email',
        recipient: email,
        subject,
        body,
        status: 'sent',
      });

      results.push({ job: job.client_name, status: 'sent' });
    }

    return Response.json({ date: tomorrow, sent: results.filter((r) => r.status === 'sent').length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});