"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/TranslationContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { Property } from "@/lib/properties";

interface ScheduleVisitModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleVisitModal({ property, isOpen, onClose }: ScheduleVisitModalProps) {
  const { t, locale } = useTranslation();
  const { user } = useAuth();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [dbFallbackUsed, setDbFallbackUsed] = useState<boolean>(false);

  // Re-initialize dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      // Preselect today + 1 day as default (or today if early enough)
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      setSelectedDate(tomorrow);
      setSelectedTime("10:00 AM");
      setMessage("");
      setIsSuccess(false);
      setDbFallbackUsed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Month navigation
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev >= minMonth) {
      setCurrentMonth(prev);
    }
  };

  // Check if we can navigate to previous month
  const canGoPrev = (() => {
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentMonth > minMonth;
  })();

  // Calendar math
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Align to Mon-Sun (Mon = 0, Tue = 1, ..., Sun = 6)
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  // Time slots
  const timeSlots = [
    { time: "09:00 AM", disabled: false },
    { time: "09:30 AM", disabled: false },
    { time: "10:00 AM", disabled: false },
    { time: "10:30 AM", disabled: false },
    { time: "11:30 AM", disabled: false },
    { time: "01:00 PM", disabled: true }, // Booked slot representation
    { time: "02:00 PM", disabled: false },
    { time: "03:30 PM", disabled: false }
  ];

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    try {
      const { error } = await supabase.from("visits").insert({
        property_id: property.id,
        user_id: user?.id || null,
        visit_date: formattedDate,
        visit_time: selectedTime,
        message: message.trim() || null
      });

      if (error) {
        console.warn("Failed to insert into visits table. Using local fallback.", error);
        setDbFallbackUsed(true);
      }
    } catch (e) {
      console.warn("Supabase database error: visits table might not exist. Mocking success state.", e);
      setDbFallbackUsed(true);
    } finally {
      // Small artificial delay for premium feel / visual feedback
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 800);
    }
  };

  // Header month title localization
  const monthTitle = currentMonth.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const capitalizedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

  // Weekdays header strings (Mon, Tue...) in correct language
  const weekdayLabels = locale === "es"
    ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    : locale === "fr"
      ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-[#0f2320]/60 backdrop-blur-md z-40 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Scroll Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <main className="pointer-events-auto relative w-full max-w-5xl bg-white dark:bg-[#162e2a] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800/80 animate-in zoom-in-95 duration-300 max-h-[95vh] md:max-h-[90vh]">
          
          {/* Close button - sticky for convenience */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-nordic dark:hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50"
            aria-label="Close modal"
          >
            <span className="material-icons text-xl">close</span>
          </button>

          {/* Left Column - Property details preview */}
          <div className="w-full md:w-5/12 bg-slate-50 dark:bg-[#112522] p-6 md:p-8 lg:p-10 flex flex-col gap-6 relative overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-mosque/5 to-transparent pointer-events-none"></div>
            
            <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-[4/3] w-full mt-2 flex-shrink-0">
              <Image 
                src={property.images[0] || "https://picsum.photos/seed/fallback/800/600"} 
                alt={property.title} 
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-3 left-3 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase text-mosque shadow-sm">
                {property.type === "sale" ? t("hero.filter_house") : t("new_in_market.rent")}
              </div>
            </div>

            <div className="space-y-4 z-10 flex-grow">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-nordic dark:text-white leading-tight">
                  {property.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5 flex items-start gap-1 text-sm">
                  <span className="material-icons text-base mt-0.5 text-mosque/80">location_on</span>
                  <span>{property.location}</span>
                </p>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-700/60">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {t("filters_modal.price_range")}
                  </span>
                  <span className="text-lg font-bold text-mosque">
                    {property.price}{property.period}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400 text-lg">bed</span>
                    <span className="text-[10px] font-semibold mt-0.5">{property.beds} {t("property_card.beds")}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400 text-lg">shower</span>
                    <span className="text-[10px] font-semibold mt-0.5">{property.baths} {t("property_card.baths")}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-slate-400 text-lg">square_foot</span>
                    <span className="text-[10px] font-semibold mt-0.5">{property.sqm} sqm</span>
                  </div>
                </div>
              </div>

              {/* Host Agent details */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <Image 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjW8nnOPHp1gOZTOS7qhMHvipD0b7viW3jmd_eAxFO7faa8rI-l2bjqTkw5xsGNAAnbxLfoLrJwf86iz_rvrcWZ1PFCBbsJs6F9fVADumsgd1pH2AorRGRV9YWFsvenDLX89W1nX6Lmk8xN6BS-BGAypyNgxlEtcnDxTSovjH9JsrUcwKHPTLVfJpIjQE_c2pIKScAf2WlFi5sf861r5TKZaownHpiub2sbluHlfsR2sZFQCxs5Lgy6J78tn3e1OQ_hBGy1V0_ueE" 
                    alt="Luxe Agent" 
                    fill 
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{t("schedule_visit_modal.hosted_by")}</p>
                  <p className="text-nordic dark:text-white font-bold text-sm">Sarah Jenkins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form or Success Screen */}
          <div className="w-full md:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
            {!isSuccess ? (
              <>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-nordic dark:text-white mb-2 mt-2">
                    {t("schedule_visit_modal.title")}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    {t("schedule_visit_modal.subtitle")}
                  </p>

                  {/* Calendar Container */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-nordic dark:text-white uppercase tracking-wider">
                        {capitalizedMonthTitle}
                      </h3>
                      <div className="flex gap-1">
                        <button 
                          onClick={prevMonth}
                          disabled={!canGoPrev}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-mosque disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-lg">chevron_left</span>
                        </button>
                        <button 
                          onClick={nextMonth}
                          className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-nordic dark:text-white hover:text-mosque transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-lg">chevron_right</span>
                        </button>
                      </div>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center mb-2">
                      {weekdayLabels.map((lbl, idx) => (
                        <div key={idx} className="text-[11px] font-bold text-slate-400 uppercase py-1">
                          {lbl}
                        </div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 text-center">
                      {/* Empty cells before start day of the month */}
                      {Array.from({ length: startDayIndex }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="py-2"></div>
                      ))}

                      {/* Actual Days */}
                      {Array.from({ length: totalDays }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const dateObj = new Date(year, month, dayNum);
                        const isPast = dateObj < today;
                        const isSelected = selectedDate !== null && 
                          selectedDate.getDate() === dayNum &&
                          selectedDate.getMonth() === month &&
                          selectedDate.getFullYear() === year;

                        if (isPast) {
                          return (
                            <button 
                              key={`day-${dayNum}`}
                              disabled
                              className="text-xs text-slate-300 dark:text-slate-600/60 py-2 rounded-lg cursor-not-allowed font-medium select-none"
                            >
                              {dayNum}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={`day-${dayNum}`}
                            onClick={() => setSelectedDate(dateObj)}
                            className={`text-xs py-2 rounded-lg transition-all relative font-medium ${
                              isSelected 
                                ? "bg-mosque text-white font-bold shadow-md shadow-mosque/30 scale-105 transform z-10" 
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-mosque cursor-pointer"
                            }`}
                          >
                            {dayNum}
                            {isSelected && (
                              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available Times */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-nordic dark:text-white uppercase tracking-wider mb-3">
                      {locale === "es" ? "Horarios Disponibles" : locale === "fr" ? "Horaires Disponibles" : "Available Times"}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((slot, idx) => {
                        const isSelected = selectedTime === slot.time;
                        if (slot.disabled) {
                          return (
                            <button
                              key={idx}
                              disabled
                              className="border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 py-2 px-1 rounded-lg text-[11px] font-medium cursor-not-allowed opacity-50 decoration-slate-300 line-through select-none"
                            >
                              {slot.time}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`border py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                              isSelected
                                ? "bg-mosque/10 dark:bg-mosque/20 border-mosque text-mosque dark:text-white"
                                : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-mosque hover:text-mosque dark:hover:text-white"
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Agent message */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-nordic dark:text-white uppercase tracking-wider mb-2" htmlFor="message">
                      {t("schedule_visit_modal.agent_message")} <span className="text-slate-400 font-normal normal-case ml-1">{t("schedule_visit_modal.optional")}</span>
                    </label>
                    <textarea 
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#112522] text-nordic dark:text-slate-200 placeholder:text-slate-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-shadow resize-none text-xs p-3 focus:outline-none" 
                      id="message" 
                      placeholder={t("schedule_visit_modal.message_placeholder")} 
                      rows={2.5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 mt-4">
                  <button 
                    onClick={onClose}
                    className="text-slate-500 dark:text-slate-400 hover:text-nordic dark:hover:text-white font-semibold px-4 py-2.5 text-xs transition-colors cursor-pointer"
                  >
                    {t("schedule_visit_modal.cancel")}
                  </button>
                  <button 
                    onClick={handleConfirm}
                    disabled={isSubmitting || !selectedDate}
                    className="bg-mosque hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded-lg shadow-md shadow-mosque/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t("schedule_visit_modal.submitting")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("schedule_visit_modal.confirm")}</span>
                        <span className="material-icons text-xs">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              // Success Screen View
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-16 w-16 rounded-full bg-mosque/10 dark:bg-mosque/20 flex items-center justify-center text-mosque mb-6 animate-bounce">
                  <span className="material-icons text-3xl font-bold">check_circle</span>
                </div>
                
                <h2 className="text-2xl font-bold text-nordic dark:text-white mb-3">
                  {t("schedule_visit_modal.success_title")}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                  {t("schedule_visit_modal.success_subtitle")}
                </p>

                <div className="w-full max-w-sm bg-slate-50 dark:bg-[#112522] rounded-xl p-5 border border-slate-100 dark:border-slate-800 text-left mb-8 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center text-xs pb-2.5 border-b border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">{t("schedule_visit_modal.selected_date")}</span>
                    <span className="text-nordic dark:text-white font-bold">
                      {selectedDate?.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">{t("schedule_visit_modal.selected_time")}</span>
                    <span className="text-nordic dark:text-white font-bold">{selectedTime}</span>
                  </div>
                </div>

                {dbFallbackUsed && (
                  <p className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/40 px-3 py-1.5 rounded-full mb-4">
                    {t("schedule_visit_modal.error_db")}
                  </p>
                )}

                <button
                  onClick={onClose}
                  className="bg-mosque hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-lg shadow-md shadow-mosque/20 hover:shadow-lg transition-all text-xs cursor-pointer"
                >
                  {t("schedule_visit_modal.close")}
                </button>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
