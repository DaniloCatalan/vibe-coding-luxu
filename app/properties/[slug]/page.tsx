import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPropertyBySlug } from '@/lib/properties';
import PropertyMapClient from '@/components/properties/PropertyMapClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found | LuxeEstate',
    };
  }

  return {
    title: `${property.title} | LuxeEstate`,
    description: `Stunning property located at ${property.location} - ${property.beds} beds, ${property.baths} baths for ${property.price}.`,
    openGraph: {
      images: [property.imageUrl],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left main area (Images) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
            <Image 
              src={property.imageUrl} 
              alt={property.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {(property.badge || property.category === 'new_in_market') && (
              <div className="absolute top-4 left-4 flex gap-2">
                {property.badge && (
                  <span className={`${property.badge === 'FOR SALE' ? 'bg-nordic-dark/90' : 'bg-mosque'} text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}>
                    {property.badge}
                  </span>
                )}
                {property.category === 'new_in_market' && (
                  <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    New
                  </span>
                )}
              </div>
            )}
            
            <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
              <span className="material-icons text-sm">grid_view</span>
              View All Photos
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {property.images && property.images.length > 0 && (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
              {property.images.slice(0, 4).map((img, i) => (
                <div key={i} className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-all ${i === 0 ? "ring-2 ring-mosque ring-offset-2 ring-offset-background-light opacity-100" : "opacity-70 hover:opacity-100"}`}>
                  <Image src={img} alt={`${property.title} img ${i+1}`} width={300} height={200} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar (Price, Agent, Map) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
              <div className="mb-4">
                <h1 className="text-4xl font-display font-light text-nordic-dark mb-2">
                  {property.price}{property.period && <span className="text-xl text-nordic-muted font-normal">{property.period}</span>}
                </h1>
                <p className="text-nordic-muted font-medium flex items-center gap-1">
                  <span className="material-icons text-mosque text-sm">location_on</span>
                  {property.location}
                </p>
              </div>
              
              <div className="h-px bg-slate-100 my-6"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                  <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA" alt="Sarah Jenkins" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">Luxe Agent</h3>
                  <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                    <span className="material-icons text-[14px]">star</span>
                    <span>Top Rated Agent</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                    <span className="material-icons text-sm">chat</span>
                  </button>
                  <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                    <span className="material-icons text-sm">call</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                  <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                  Schedule Visit
                </button>
                <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                  <span className="material-icons text-xl">mail_outline</span>
                  Contact Agent
                </button>
              </div>
            </div>

            {/* Map Area */}
            {property.lat && property.lng && (
              <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 z-0">
                  <PropertyMapClient lat={property.lat} lng={property.lng} title={property.title} />
                  <a href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-[400] bg-white/90 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md text-nordic-dark hover:text-mosque backdrop-blur transition-colors">
                    View full map
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main Details Section */}
        <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
          
          {/* Features */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Property Features</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                <span className="text-xl font-bold text-nordic-dark">{property.sqm.toLocaleString()}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Square Meters</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                <span className="text-xl font-bold text-nordic-dark">2</span>
                <span className="text-xs uppercase tracking-wider text-nordic-muted">Garage</span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-4 text-nordic-dark">About this home</h2>
            <div className="prose prose-slate max-w-none text-nordic-dark/70 leading-relaxed font-display">
              <p className="mb-4">
                Experience luxury living in this stunning property featuring modern amenities, beautiful architectural details, and comfortable spaces perfectly designed for entertaining or relaxation.
              </p>
              <p>
                Situated in an excellent location, this {property.type} opportunity delivers both lifestyle and value. 
              </p>
            </div>
            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Read more
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>
          
          {/* Amenities */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {['Smart Home System', 'Swimming Pool', 'Central Heating & Cooling', 'Electric Vehicle Charging', 'Private Gym', 'Wine Cellar'].map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-nordic-dark/70">
                  <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mortgage Calc */}
          {property.type === 'sale' && (
            <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <span className="material-icons">calculate</span>
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">Estimated Payment</h3>
                  <p className="text-sm text-nordic-muted">Starting from <strong className="text-mosque">{property.price}/mo</strong> with 20% down</p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark">
                Calculate Mortgage
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
