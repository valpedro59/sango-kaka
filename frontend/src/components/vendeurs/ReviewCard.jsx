import SellerRating from "./SellerRating";

function ReviewCard({avis}) {
    return(
        <article className="rounded-2xl border border-[#E5E5E7] bg-white p-5 transition hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] font-semibold text-[#0066CC]">
                        {avis.auteur.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#1D1D1F]">
                            {avis.auteur}
                        </h3>
                        <p className="text-xs text-[#6E6E73]">
                            Avis client
                        </p>
                    </div>
                </div>
                <SellerRating note={avis.note}/>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#4A4A4F]">
                {avis.commentaire}
            </p>

        </article>
    );
    
}

export default ReviewCard;