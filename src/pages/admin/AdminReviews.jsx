import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";

export default function AdminReviews() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    base44.entities.Review.list("-created_date", 100).then(setReviews);
  }, []);

  if (!reviews) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin" />
      </div>
    );
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1F2933]">Reviews</h1>
        {avg && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Star className="w-5 h-5 fill-[#F5A623] text-[#F5A623]" />
            <span className="font-bold text-[#1F2933]">{avg}</span>
            <span className="text-sm text-gray-500">({reviews.length})</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            No reviews yet. Clients receive a rating link automatically when their job is marked completed.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= review.rating ? "fill-[#F5A623] text-[#F5A623]" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="font-semibold text-[#1F2933]">
                      {review.client_name || "Anonymous"}
                      {review.service && (
                        <span className="text-sm font-normal text-gray-500"> · {review.service}</span>
                      )}
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 mt-2">{review.comment}</p>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {format(new Date(review.created_date), "d MMM yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}