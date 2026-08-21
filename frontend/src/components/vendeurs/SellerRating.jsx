function SellerRating({note}) {
    const nombreEtoiles= 5;

    return(
        <div className="flex items-center gap-2">
            <div 
                className="flex gap-0.5"
                aria-label={`Note de ${note} sur 5`}
            >
                {Array.from({ length: nombreEtoiles}, (_,index) =>(
                                 <span
                        key={index}
                        className={
                            index < Math.round(note)
                            ? "text-yellow-400 text-lg"
                            : "text-gray-300 text-lg"
                        }

                    >
                         ★

                    </span>
                ))}
            </div>

            <span className="text-sm font-semibold text-[#1D1D1F]">
                {note.toFixed(1)}
            </span>
        </div>
    );
    
}

export default SellerRating;