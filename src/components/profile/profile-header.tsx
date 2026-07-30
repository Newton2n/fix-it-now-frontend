import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileHeaderProps = {
  name: string;
  email: string;
  role: string;
  status: string;
  profilePicture: string | null;
  onEditProfile?: () => void;
  onBecomeTechnician?: () => void;
};

export default function ProfileHeader({
  name,
  email,
  role,
  status,
  profilePicture,
  onEditProfile,
  onBecomeTechnician,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar className="h-20 w-20 rounded-2xl border">
          <AvatarImage src={profilePicture ?? ""} alt={name} />
          <AvatarFallback className="rounded-2xl text-lg font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full px-3">
              {role}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3">
              {status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onEditProfile}>
              Edit Profile
            </Button>

            {role === "CUSTOMER" && onBecomeTechnician ? (
              <Button onClick={onBecomeTechnician}>Become a Technician</Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}