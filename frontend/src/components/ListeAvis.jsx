import NoteEtoiles from "./NoteEtoiles";

export default function ListeAvis({ reviews }) {
  if (!reviews.length) return null;

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-lg font-extrabold text-neutral-900">
        Avis clients
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">
                {review.authorName}
              </p>
              <NoteEtoiles note={review.note} />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">
              {review.commentaire}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
