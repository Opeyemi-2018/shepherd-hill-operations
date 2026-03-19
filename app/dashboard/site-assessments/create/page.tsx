"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Paperclip, Loader2, X, MapPin } from "lucide-react";
import { toast } from "sonner";

// Type for Clients dropdown
interface Client {
    id: number;
    name: string;
}

const CreateAssessment = () => {
    const { token } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form States
    const [loading, setLoading] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);

    // Field States (Mapped to DB Schema)
    const [clientId, setClientId] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [facilityType, setFacilityType] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guardStrength, setGuardStrength] = useState("");
    const [requirements, setRequirements] = useState("");
    const [cadreType, setCadreType] = useState("");
    const [armedPolice, setArmedPolice] = useState("0");
    const [shiftPattern, setShiftPattern] = useState("");
    const [securityRisks, setSecurityRisks] = useState("");
    const [observations, setObservations] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // 1. Fetch Clients
    useEffect(() => {
        const fetchClients = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/client`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await response.json();

                if (result.status || result.success) {
                    const clientData = result.data?.data || result.data || [];
                    setClients(clientData);
                }
            } catch (error) {
                console.error("Failed to load clients:", error);
                toast.error("Failed to load clients list.");
            }
        };
        fetchClients();
    }, [token]);

    // 2. Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB limit.");
                return;
            }
            setSelectedFile(file);
        }
    };

    // 3. Auto-fetch GPS Coordinates
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude.toString());
                setLongitude(position.coords.longitude.toString());
                setFetchingLocation(false);
                toast.success("Location fetched successfully!");
            },
            (error) => {
                setFetchingLocation(false);
                toast.error("Unable to retrieve your location. Please enter manually.");
                console.error("Geolocation error:", error);
            },
            { enableHighAccuracy: true }
        );
    };

    // 4. Handle Form Submission
    const handleSubmit = async () => {
        if (!clientId || !address || !facilityType || !latitude || !longitude) {
            toast.error("Please fill in all required fields, including coordinates.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("client_id", clientId);
            formData.append("site_address", address);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("facility_type", facilityType);

            if (date) formData.append("assessment_date", date);
            if (time) formData.append("assessment_time", time);
            if (guardStrength) formData.append("guard_strength", guardStrength);
            if (requirements) formData.append("guard_requirement_description", requirements);
            if (cadreType) formData.append("cadre_type", cadreType);
            formData.append("armed_police_required", armedPolice);
            if (shiftPattern) formData.append("shift_pattern", shiftPattern);
            if (securityRisks) formData.append("security_risks", securityRisks);
            if (observations) formData.append("general_observations", observations);

            if (selectedFile) formData.append("photo", selectedFile);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/assessments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && (result.status || result.success)) {
                toast.success("Assessment request saved successfully!");
                router.push("/dashboard/site-assessments");
            } else {
                toast.error(result.message || "Failed to save assessment.");
                if (result.errors) console.log(result.errors);
            }

        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 pb-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#3A3A3A] dark:text-white">Site Assessment</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Comprehensive Site Evaluation Form</p>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-card">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <CardTitle className="text-lg font-bold text-[#3A3A3A] dark:text-white">
                        Assessment Details
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">

                    {/* --- SECTION 1: BASIC INFO --- */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#FAB435]">1. Location & Client Info</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Client <span className="text-red-500">*</span></Label>
                                <Select onValueChange={setClientId} value={clientId}>
                                    <SelectTrigger className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:ring-[#FAB435]">
                                        <SelectValue placeholder="Select Client" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">
                                        {clients.length > 0 ? (
                                            clients.map((client) => (
                                                <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-gray-500 text-center">No clients found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Facility Type <span className="text-red-500">*</span></Label>
                                <Select onValueChange={setFacilityType} value={facilityType}>
                                    <SelectTrigger className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:ring-[#FAB435]">
                                        <SelectValue placeholder="Select Facility Type" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">
                                        <SelectItem value="Corporate Office">Corporate Office</SelectItem>
                                        <SelectItem value="Industrial Facility">Industrial Facility</SelectItem>
                                        <SelectItem value="Retail Mall">Retail Mall</SelectItem>
                                        <SelectItem value="Residential Estate">Residential Estate</SelectItem>
                                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Site Address <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="Enter full address"
                                className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435]"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Latitude <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number" step="any" placeholder="e.g. 6.5244"
                                    className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435]"
                                    value={latitude} onChange={(e) => setLatitude(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Longitude <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number" step="any" placeholder="e.g. 3.3792"
                                        className="h-12 flex-1 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435]"
                                        value={longitude} onChange={(e) => setLongitude(e.target.value)}
                                    />
                                    <Button
                                        type="button" variant="outline" onClick={handleGetLocation} disabled={fetchingLocation}
                                        className="h-12 w-12 p-0 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-[#FAB435]"
                                        title="Get Current Location"
                                    >
                                        {fetchingLocation ? <Loader2 className="h-4 w-4 animate-spin text-[#FAB435]" /> : <MapPin className="h-4 w-4 text-[#FAB435]" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Assessment Date</Label>
                                <Input
                                    type="date"
                                    className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus-visible:ring-[#FAB435] block w-full"
                                    value={date} onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Assessment Time</Label>
                                <Input
                                    type="time"
                                    className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus-visible:ring-[#FAB435] block w-full"
                                    value={time} onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* --- SECTION 2: DEPLOYMENT DETAILS --- */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#FAB435]">2. Deployment Requirements</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Guard Strength</Label>
                                <Input
                                    type="number" min="0" placeholder="e.g. 5"
                                    className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435]"
                                    value={guardStrength} onChange={(e) => setGuardStrength(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Cadre Type</Label>
                                <Select onValueChange={setCadreType} value={cadreType}>
                                    <SelectTrigger className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:ring-[#FAB435]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">
                                        <SelectItem value="Standard">Standard</SelectItem>
                                        <SelectItem value="Supervisory">Supervisory</SelectItem>
                                        <SelectItem value="Executive">Executive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Shift Pattern</Label>
                                <Select onValueChange={setShiftPattern} value={shiftPattern}>
                                    <SelectTrigger className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:ring-[#FAB435]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">
                                        <SelectItem value="12 Hours">12 Hours (Day/Night)</SelectItem>
                                        <SelectItem value="8 Hours">8 Hours (3 Shifts)</SelectItem>
                                        <SelectItem value="24 Hours">24 Hours (Continuous)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Armed Police?</Label>
                                <Select onValueChange={setArmedPolice} value={armedPolice}>
                                    <SelectTrigger className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:ring-[#FAB435]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200">
                                        <SelectItem value="0">No</SelectItem>
                                        <SelectItem value="1">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Guard Requirement Description</Label>
                            <Input
                                placeholder="Specific instructions or duties required..."
                                className="h-12 bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435]"
                                value={requirements} onChange={(e) => setRequirements(e.target.value)}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* --- SECTION 3: OBSERVATIONS & ATTACHMENTS --- */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#FAB435]">3. Risk & Observations</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Security Risks Found</Label>
                                <Textarea
                                    placeholder="Describe any vulnerabilities, blind spots, or perimeter issues..."
                                    className="min-h-[120px] bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435] resize-y"
                                    value={securityRisks} onChange={(e) => setSecurityRisks(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">General Observations</Label>
                                <Textarea
                                    placeholder="Additional context about the site layout, neighborhood, etc..."
                                    className="min-h-[120px] bg-white text-[#3A3A3A] border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 focus-visible:ring-[#FAB435] resize-y"
                                    value={observations} onChange={(e) => setObservations(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#3A3A3A] dark:text-gray-200 font-medium">Site Photo / Attachment</Label>
                            <div
                                className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-900/50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={handleFileChange}
                                />

                                {selectedFile ? (
                                    <div className="flex items-center gap-2 text-[#FAB435]">
                                        <Paperclip className="h-5 w-5" />
                                        <span className="text-sm font-medium">{selectedFile.name}</span>
                                        <Button
                                            type="button" variant="ghost" size="sm"
                                            className="h-6 w-6 p-0 hover:bg-transparent text-gray-400 hover:text-red-500 dark:hover:bg-transparent"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                if(fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
                                        <Paperclip className="h-6 w-6 mb-1" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload image</span>
                                        <span className="text-xs">JPG, PNG up to 5MB</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
                        <Button
                            type="button" variant="ghost" disabled={loading} onClick={() => router.back()}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium px-6 h-12"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button" disabled={loading} onClick={handleSubmit}
                            className="bg-[#FAB435] hover:bg-[#d99820] text-white font-bold px-8 h-12 shadow-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Assessment"
                            )}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default CreateAssessment;