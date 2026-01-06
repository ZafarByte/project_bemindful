"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ShieldAlert, HeartHandshake, X, Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PsychiatristListModal } from "@/components/dashboard/psychiatrist-list-modal";

export function SOSButton() {
  const [open, setOpen] = useState(false);
  const [showPsychiatristList, setShowPsychiatristList] = useState(false);

  return (
    <>
      <Button
        size="lg"
        variant="destructive"
        className={cn(
            "fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300 animate-pulse",
            open ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        onClick={() => setOpen(true)}
      >
        <ShieldAlert className="w-6 h-6" />
        <span className="sr-only">SOS Emergency Help</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md border-rose-200 bg-rose-50/95 backdrop-blur-sm">
          <DialogHeader>
            <div className="mx-auto bg-rose-100 p-3 rounded-full mb-2">
              <ShieldAlert className="w-8 h-8 text-rose-600" />
            </div>
            <DialogTitle className="text-center text-xl text-rose-700">Emergency Support</DialogTitle>
            <DialogDescription className="text-center text-rose-600/80">
              You are not alone. Help is available right now.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
               <a 
                 href="tel:112" 
                 className="flex items-center gap-4 p-4 rounded-xl bg-white border border-rose-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group"
               >
                 <div className="bg-rose-100 p-2.5 rounded-full group-hover:bg-rose-200 transition-colors">
                   <Phone className="w-5 h-5 text-rose-600" />
                 </div>
                 <div className="flex-1">
                   <p className="font-semibold text-gray-900">National Emergency Number</p>
                   <p className="text-sm text-gray-500">Available 24/7</p>
                 </div>
                 <span className="text-lg font-bold text-rose-600">112</span>
               </a>

               <a 
                 href="tel:988" 
                 className="flex items-center gap-4 p-4 rounded-xl bg-white border border-rose-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group"
               >
                 <div className="bg-rose-100 p-2.5 rounded-full group-hover:bg-rose-200 transition-colors">
                   <HeartHandshake className="w-5 h-5 text-rose-600" />
                 </div>
                 <div className="flex-1">
                   <p className="font-semibold text-gray-900">Suicide Prevention Helpline</p>
                   <p className="text-sm text-gray-500">Kiran Helpline</p>
                 </div>
                 <span className="text-lg font-bold text-rose-600">1800-599-0019</span>
               </a>

               <button
                 onClick={() => setShowPsychiatristList(true)}
                 className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-rose-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all group text-left"
               >
                 <div className="bg-rose-100 p-2.5 rounded-full group-hover:bg-rose-200 transition-colors">
                   <Stethoscope className="w-5 h-5 text-rose-600" />
                 </div>
                 <div className="flex-1">
                   <p className="font-semibold text-gray-900">Find a Psychiatrist</p>
                   <p className="text-sm text-gray-500">Professional Help Nearby</p>
                 </div>
                 <span className="text-sm font-medium text-rose-600">View List &rarr;</span>
               </button>
            </div>

            <div className="bg-white/50 p-4 rounded-lg text-center text-sm text-rose-800">
              <p className="font-medium mb-1">Breathing Exercise</p>
              <p>Inhale for 4s • Hold for 4s • Exhale for 4s</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-100"
            onClick={() => setOpen(false)}
          >
            I'm feeling better now
          </Button>
        </DialogContent>
      </Dialog>
      
      <PsychiatristListModal 
        open={showPsychiatristList} 
        onOpenChange={setShowPsychiatristList} 
      />
    </>
  );
}
