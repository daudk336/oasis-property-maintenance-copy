import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Reject direct calls from non-admin users; automation runs pass through
    let user = null;
    try {
      user = await base44.auth.me();
    } catch (_) {
      // no user context (automation trigger)
    }
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await req.json().catch(() => ({}));
    const job = payload.data || null;
    const jobId = payload.event?.entity_id || job?.id;

    if (!job || job.status !== 'completed') {
      return Response.json({ skipped: true, reason: 'Job not completed' });
    }

    // Find client email
    const clients = await base44.asServiceRole.entities.Client.filter({ name: job.client_name });
    const client = clients[0];
    const email = client?.email;
    if (!email) {
      return Response.json({ skipped: true, reason: 'No email on file for client' });
    }

    const subject = `How did we do? Rate your ${job.service} (${job.date})`;

    // Skip if we already sent this review request
    const existing = await base44.asServiceRole.entities.Message.filter({ recipient: email, subject });
    if (existing.length > 0) {
      return Response.json({ skipped: true, reason: 'Review request already sent' });
    }

    const appUrl = `https://base44.app/apps/${Deno.env.toObject()['BASE44_APP_ID']}`;
    const params = new URLSearchParams({
      job: jobId || '',
      name: job.client_name || '',
      service: job.service || '',
    });
    const reviewLink = `${appUrl}/Review?${params.toString()}`;

    const firstName = (job.client_name || 'there').split(' ')[0];
    const body = `Hi ${firstName},

Thanks for choosing FreshCut Property Services! We've just completed your ${job.service}.

We'd love to hear how we did. It only takes 30 seconds:

${reviewLink}

Your feedback helps us keep our service sharp.

Thanks again,
FreshCut Property Services`;

    let status = 'sent';
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject,
        body,
        from_name: 'FreshCut Property Services',
      });
    } catch (e) {
      // Recipient not a registered app user — log the message instead
      console.log('SendEmail failed, logging message instead:', e.message);
      status = 'logged';
    }

    await base44.asServiceRole.entities.Message.create({
      client_name: job.client_name,
      channel: 'email',
      recipient: email,
      subject,
      body,
      status,
    });

    return Response.json({ status, recipient: email, reviewLink });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});