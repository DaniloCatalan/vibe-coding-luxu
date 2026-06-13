"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/TranslationContext";
import { Property } from "@/lib/properties";
import ScheduleVisitModal from "./ScheduleVisitModal";

interface ScheduleVisitSectionProps {
  property: Property;
}

export default function ScheduleVisitSection({ property }: ScheduleVisitSectionProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-3">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
          {t("property_page.schedule_visit")}
        </button>
        <button 
          onClick={() => {
            // Simulated contact action
            alert(t("property_page.contact_agent") + ": info@luxeestate.com");
          }}
          className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-icons text-xl">mail_outline</span>
          {t("property_page.contact_agent")}
        </button>
      </div>

      <ScheduleVisitModal 
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
