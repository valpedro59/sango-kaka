export default function NoteEtoiles({ note, afficherValeur = false }) {
  const noteNumerique = Number(note) || 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`Note ${note}/5`}>
        {[1, 2, 3, 4, 5].map((etoile) => (
          <svg
            key={etoile}
            viewBox="0 0 20 20"
            fill={etoile <= Math.round(noteNumerique) ? "#F59E0B" : "#D1D5DB"}
            className="h-4 w-4"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        ))}
      </div>
      {afficherValeur && (
        <span className="text-sm font-semibold text-[#1D1D1F]">
          {noteNumerique.toFixed(1)}
        </span>
      )}
    </div>
  );
}