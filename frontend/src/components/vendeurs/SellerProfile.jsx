import SellerRating from "./SellerRating";
import ReviewCard from "./ReviewCard";

const vendeur = {
    id:3,
    nom: "KITSORO Louissel",
    telephone: "+242068069454",
    whatsapp: "+242068069454",
    quartier: "Bacongo",
    dateInscription: "2026-05-12T00:00:00.000z",
};

const avis = [
    {
        id:1,
        vendeurId: 3,
        note: 5,
        commentaire: "Vendeur sérieux",
        auteur: "Client A",
    },
    {
        id:2,
        vendeurId: 3,
        note: 4,
        commentaire: "Transaction rapide et vendeur disponible",
        auteur: "Client B",
    },
];

const noteMoyenne = 4.5 ;

function SellerProfile() {
    return(
        <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
            {/* En-tete*/}
            <div className="mb-8">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0066CC]">
                    Profil vendeur
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1D1D1F] md:text-4xl" >
                    Découvrez ce vendeur
                </h1>

                <p className="mt-2 text-2xl text-sm leading-6 text-[#6E6E73] md:text-base">
                    Consultez les informations et les avis des clients avant de prendre contact.
                </p>
            </div>

            {/*Carte Profil*/}
            <section className="overflow-hidden rounded-3xl border border-[#E5E5E7] bg-white shadow-sm">
                {/*Bandeau*/}
                <div className="px-5 pb-7 md:px-8">
                    <div className="mt-12 flex flex-col gap-5 md:flex-row md-items-end md:justify-between">
                        {/*IDENTITE */}
                        <div className="flex items-end gap-4">
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#EAF3FF] text-bold text-[#0066CC] shadow-sm">
                                {vendeur.nom.charAt(0)}
                            </div>

                            <div className="pb-1">
                                <h2 className="text-2xl font-bold text-[#1D1D1F]">
                                    {vendeur.nom}
                                </h2>
                                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6E6E73]">
                                    <span>📍</span>
                                    {vendeur.quartier}
                                </p>
                            </div>
                        </div>

                        {/*NOTE*/}
                        <div className="rounded-2xl bg-[#F5F5F7] px-5 py-4">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                                Note moyenne
                            </p>
                            <SellerRating note={noteMoyenne}/>
                        </div>
                    </div>

                    {/* STATISTIQUES */}
                    <div className="mt-8 grid grid-cols-1 divide-y divide-[#E5E5E7] rounded-2xl border border-[#E5E5E7] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-[#1D1D1F]">
                                {noteMoyenne}
                            </p>
                            

                            <p className="mt-1 text-xs text-[#6E6E73]">
                                Note moyenne
                            </p>
                        </div>

                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-[#1D1D1F]">
                                {avis.length}
                            </p>

                            <p className="mt-1 text-xs text-[#6E6E73]">
                                Avis clients
                            </p>
                        </div>

                        <div className="p-4 text-center">
                            <p className="text-2xl font-bold text-[#1D1D1F]">
                                Mai 2026
                            </p>
                            <p className="mt-1 text-xs text-[#6E6E73]">
                                Inscrit depuis
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AVIS */}
            <section className="mt-10">
                <div className="mb-5 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1D1D1F]">
                            Avis des clients
                        </h2>
                        <p className="mt-1 text-sm text-[#6E6E73]">
                            Ce que les clients pensent de ce vendeur.
                        </p>
                        
                    </div>
                    <span className="hidden rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-semibold text-[#0066CC] sm:block">
                        {avis.length} avis
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {avis.map((avisItem)=>(
                        <ReviewCard 
                            key={avisItem.id}
                            avis={avisItem}
                        />

                    ))}
                </div>
            </section>
        </div>
    );
    
}

export default SellerProfile;