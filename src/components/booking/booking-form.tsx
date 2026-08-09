"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, Loader2, UserRound, MapPin } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import Image from "next/image";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import { createBooking } from "@/actions/bookings.action";

type AvailabilitySlot = {
  start: string;
  end: string;
};

type TechnicianAvailability = Record<string, AvailabilitySlot>;

type Service = {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  galleryImages?: string[];
};

type Technician = {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  isAvailable: boolean;
  yearsOfExperience: string;
  availability: TechnicianAvailability;
  status: string;
  serviceArea?: string[];
};

type BookingFormProps = {
  service: Service;
  technician: Technician;
  technicianName?: string;
  technicianProfilePicture?: string | null;
  isCustomer: boolean;
};

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type DayName = (typeof DAYS)[number];

function normalizeTime(time: string) {
  return time.replace(/\s/g, "");
}

function timeToMinutes(time: string) {
  const normalized = normalizeTime(time);

  let [hours, minutes] = normalized.split(":").map(Number);

  if (Number.isNaN(hours)) {
    return 0;
  }

  if (Number.isNaN(minutes)) {
    minutes = 0;
  }

  if (hours === 24) {
    return 24 * 60;
  }

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const date = new Date();

  date.setHours(hours, mins, 0, 0);

  return format(date, "hh:mm a");
}

function getDayName(date: Date): DayName {
  return DAYS[date.getDay()];
}

function generateTimeSlots(start: string, end: string) {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  const slots: string[] = [];

  for (let current = startMinutes; current < endMinutes; current += 30) {
    slots.push(minutesToTime(current));
  }

  return slots;
}

function createScheduledAt(date: Date, time: string) {
  const [timeValue, period] = time.split(" ");

  let [hours, minutes] = timeValue.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const scheduledAt = new Date(date);

  scheduledAt.setHours(hours, minutes, 0, 0);

  return scheduledAt;
}

export default function BookingForm({
  service,
  technician,
  technicianName = "Technician",
  technicianProfilePicture,
  isCustomer,
}: BookingFormProps) {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>();

  const [selectedTime, setSelectedTime] = useState<string>();

  const [selectedLocation, setSelectedLocation] = useState<string>();

  const [customerNote, setCustomerNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Technician available weekdays

  const availableDays = useMemo(() => {
    return DAYS.filter((day) => technician.availability?.[day]);
  }, [technician.availability]);

  // Technician service areas

  const serviceAreas = useMemo(() => {
    return technician.serviceArea ?? [];
  }, [technician.serviceArea]);

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());

    if (isBefore(startOfDay(date), today)) {
      return true;
    }

    const dayName = getDayName(date);

    return !technician.availability?.[dayName];
  };

  // Generate 30-minute slots

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    const dayName = getDayName(selectedDate);

    const availability = technician.availability?.[dayName];

    if (!availability) {
      return [];
    }

    return generateTimeSlots(availability.start, availability.end);
  }, [selectedDate, technician.availability]);

  //Date selection

  const handleDateChange = (date: Date | undefined) => {
    if (!isCustomer) {
      return;
    }

    setSelectedDate(date);

    // Reset time when date changes
    setSelectedTime(undefined);
  };

  // Submit booking

  const handleSubmit = async () => {
    if (!isCustomer) {
      toast.error("Only customers can create bookings.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }

    if (!selectedTime) {
      toast.error("Please select a time slot.");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select a service location.");
      return;
    }

    const scheduledAt = createScheduledAt(selectedDate, selectedTime);

    if (scheduledAt <= new Date()) {
      toast.error("Please select a future time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        serviceId: service.id,
        scheduledAt: scheduledAt.toISOString(),
        location: selectedLocation,
        customerNote: customerNote.trim() || undefined,
      };

      

      const result = await createBooking(payload);

      if (!result?.success) {
        toast.error(result?.message || "Unable to create booking.");

        return;
      }

      // Booking successful

      toast.success("Booking request submitted successfully.");

      // Send customer to booking list

      router.push("/dashboard/customer/bookings");
    } catch (error) {
      console.error("Create booking error:", error);

      toast.error("Something went wrong while creating the booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-5 py-6 sm:px-8 lg:px-[clamp(2rem,6vw,7rem)]">
      <div className="mx-auto grid w-full max-w-[110rem] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
        {/* 
            LEFT SIDE
        */}

        <div className="space-y-6">
          {/* Technician */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                  {technicianProfilePicture ? (
                    <Image
                      src={technicianProfilePicture}
                      alt={technicianName}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-6 text-muted-foreground" />
                  )}
                </div>

                {/* Technician Info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{technicianName}</h2>

                    {technician.status === "VERIFIED" && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {technician.yearsOfExperience} years experience
                  </p>
                </div>
              </div>

              {/* Skills */}
              {technician.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {technician.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 
              SERVICE AREA
           */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="size-5" />
                Service Area
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Select where you want the technician to provide the service.
              </p>
            </CardHeader>

            <CardContent>
              {serviceAreas.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {serviceAreas.map((area) => {
                    const isSelected = selectedLocation === area;

                    return (
                      <Button
                        key={area}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className="w-full capitalize"
                        disabled={!isCustomer}
                        onClick={() => setSelectedLocation(area)}
                      >
                        <MapPin className="mr-2 size-4" />
                        {area}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm font-medium">
                    No service area available
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This technician has not configured any service area.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 
              AVAILABLE DAYS
          */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="size-5" />
                Available Days
              </CardTitle>
            </CardHeader>

            <CardContent>
              {availableDays.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {availableDays.map((day) => {
                    const availability = technician.availability[day];

                    return (
                      <div
                        key={day}
                        className="rounded-lg border bg-muted/30 p-3"
                      >
                        <p className="text-sm font-medium capitalize">{day}</p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {availability.start} - {availability.end}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This technician has no available days.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 
              DATE PICKER
          */}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose a date</CardTitle>

              <p className="text-sm text-muted-foreground">
                Select one of the technician&apos;s available days.
              </p>
            </CardHeader>

            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={!isCustomer ? () => true : isDateDisabled}
                className="rounded-md border"
                startMonth={new Date()}
              />
            </CardContent>
          </Card>

          {/* 
              TIME SLOTS
          */}

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock3 className="size-5" />
                  Available time
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
              </CardHeader>

              <CardContent>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {availableTimeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <Button
                          key={time}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className="w-full"
                          disabled={!isCustomer}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm font-medium">
                      No available time slots
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Please select another available date.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 
              CUSTOMER NOTE
           */}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional note</CardTitle>

              <p className="text-sm text-muted-foreground">
                Add anything the technician should know before the appointment.
              </p>
            </CardHeader>

            <CardContent>
              <Textarea
                value={customerNote}
                onChange={(event) => setCustomerNote(event.target.value)}
                placeholder="Example: Please bring the necessary tools."
                rows={4}
                maxLength={500}
                disabled={!isCustomer}
              />

              <p className="mt-2 text-right text-xs text-muted-foreground">
                {customerNote.length}/500
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 
            RIGHT SIDE
         */}

        <div className="lg:sticky lg:top-6 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Booking summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Service */}
              <div>
                <p className="text-sm text-muted-foreground">Service</p>

                <p className="mt-1 font-medium">{service.title}</p>
              </div>

              <Separator />

              {/* Price */}
              <div>
                <p className="text-sm text-muted-foreground">Price</p>

                <p className="mt-1 text-2xl font-bold">
                  {service.price} {service.currency}
                </p>
              </div>

              <Separator />

              {/* Location */}
              <div>
                <p className="text-sm text-muted-foreground">
                  Service location
                </p>

                <p className="mt-1 flex items-center gap-2 font-medium capitalize">
                  <MapPin className="size-4 text-muted-foreground" />

                  {selectedLocation || "Not selected"}
                </p>
              </div>

              <Separator />

              {/* Date */}
              <div>
                <p className="text-sm text-muted-foreground">Selected date</p>

                <p className="mt-1 font-medium">
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : "Not selected"}
                </p>
              </div>

              {/* Time */}
              <div>
                <p className="text-sm text-muted-foreground">Selected time</p>

                <p className="mt-1 font-medium">
                  {selectedTime || "Not selected"}
                </p>
              </div>

              {/* Non-customer */}
              {!isCustomer && (
                <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-center">
                  <p className="text-sm font-medium">
                    Customer account required
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Only customers can make a booking.
                  </p>
                </div>
              )}

              {/* Service unavailable */}
              {!service.isAvailable && (
                <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-center">
                  <p className="text-sm font-medium">Service unavailable</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This service is currently unavailable.
                  </p>
                </div>
              )}

              {/* Technician unavailable */}
              {!technician.isAvailable && (
                <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-center">
                  <p className="text-sm font-medium">Technician unavailable</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This technician is currently unavailable.
                  </p>
                </div>
              )}

              {/* Booking Button */}
              <Button
                type="button"
                className="w-full"
                size="lg"
                disabled={
                  !isCustomer ||
                  isSubmitting ||
                  !selectedDate ||
                  !selectedTime ||
                  !selectedLocation ||
                  !service.isAvailable ||
                  !technician.isAvailable
                }
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Request Booking"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Your booking will be sent to the technician for approval.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
