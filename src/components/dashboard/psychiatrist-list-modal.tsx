
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, MapPin, Star, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Psychiatrist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  contact: string;
  rating: number;
  image: string;
}

// Dummy data for Indian psychiatrists
const PSYCHIATRISTS: Psychiatrist[] = [
  {
    id: "1",
    name: "Dr. Anjali Sharma",
    specialty: "Clinical Psychiatrist",
    experience: "12 years",
    location: "Park Street, Kolkata",
    contact: "+91 98765 43210",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "2",
    name: "Dr. Rajesh Gupta",
    specialty: "Neuropsychiatrist",
    experience: "15 years",
    location: "Salt Lake, Kolkata",
    contact: "+91 98123 45678",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "3",
    name: "Dr. Priya Venkatesh",
    specialty: "Child & Adolescent Specialist",
    experience: "8 years",
    location: "Ballygunge, Kolkata",
    contact: "+91 91234 56789",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    specialty: "Addiction Psychiatrist",
    experience: "20 years",
    location: "New Town, Kolkata",
    contact: "+91 99887 76655",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "5",
    name: "Dr. Meera Iyer",
    specialty: "Therapist & Counselor",
    experience: "10 years",
    location: "Alipore, Kolkata",
    contact: "+91 98765 12345",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
  },
];

interface PsychiatristListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PsychiatristListModal({
  open,
  onOpenChange,
}: PsychiatristListModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-full bg-rose-500/10">
                <Stethoscope className="w-6 h-6 text-rose-500" />
              </div>
              <DialogTitle>Find Professional Help</DialogTitle>
            </div>
            <DialogDescription>
              Based on your recent mood scores, consider reaching out to one of these verified specialists.
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 min-h-0 px-6">
          <div className="space-y-4 py-4">
            {PSYCHIATRISTS.map((doctor) => (
              <Card key={doctor.id} className="border-border/60 hover:border-primary/30 transition-all">
                <CardContent className="p-4 flex gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 border border-border bg-muted">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {doctor.rating}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {doctor.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5" />
                            {doctor.experience} exp
                        </div>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-secondary/20 p-3 border-t flex justify-between items-center px-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Phone className="w-4 h-4 text-green-600" />
                        {doctor.contact}
                    </div>
                    <Button size="sm" variant="default">Book Appointment</Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 pt-0 mt-auto">
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
