"use client";

import { useState, useRef } from "react";
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
    SelectValue
} from "@/components/ui/select";
import { Paperclip, Loader2, X, UploadCloud, Plus, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

const CreatePatrolLog = () => {
    const { token } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    // Core Form Data
    const [formData, setFormData] = useState({
        location: "",
        patrol_area: "",
        patrol_date: "",
        patrol_time: "",
        observation: "",
        incident_found: "false",
        incident_description: ""
    });

    // Dynamic Guards List
    const [guards, setGuards] = useState<string[]>([""]);

    // Essential Items Checklist
    const [essentialItems, setEssentialItems] = useState({
        logbook: false,
        radio: false,
        torchlight: false,
        metal_detector: false,
        uniform_id: false,
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // Guard Dynamic Input Handlers
    const updateGuard = (index: number, value: string) => {
        const newGuards = [...guards];
        newGuards[index] = value;
        setGuards(newGuards);
    };
    const addGuard = () => setGuards([...guards, ""]);
    const removeGuard = (index: number) => setGuards(guards.filter((_, i) => i !== index));

    // Essential Item Toggle
    const toggleItem = (key: keyof typeof essentialItems) => {
        setEssentialItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validation
        const validGuards = guards.filter(g => g.trim() !== "");
        if (validGuards.length === 0 || !formData.location || !formData.patrol_area || !formData.patrol_date || !formData.patrol_time) {
            toast.error("Please fill in all required fields and add at least one guard.");
            return;
        }

        if (formData.incident_found === "true" && !formData.incident_description) {
            toast.error("Please provide an incident description.");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            // Append standard fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'incident_found') {
                    data.append(key, value === "true" ? "1" : "0");
                } else {
                    data.append(key, value);
                }
            });

            // Append Arrays & Objects
            data.append("guards_on_site", JSON.stringify(validGuards));
            data.append("essential_items", JSON.stringify(essentialItems));

            // Append Files
            selectedFiles.forEach((file) => {
                data.append("evidence[]", file);
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/patrol-logs`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });

            const result = await response.json();

            if (response.ok && (result.status || result.success)) {
                toast.success("Patrol report submitted successfully");
                router.push("/dashboard/patrol-updates");
            } else {
                toast.error(result.message || "Failed to submit report");
                if (result.errors) console.log(result.errors);
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 pb-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#3A3A3A] dark:text-slate-50">New Patrol Updates</h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm">Record patrol activity and personnel on site</p>
            </div>

            <Card className="border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-gray-100 dark:border-slate-800 pb-4 bg-gray-50/50 dark:bg-slate-900/50">
                    <CardTitle className="text-lg font-bold text-[#3A3A3A] dark:text-slate-50">
                        Patrol Report Form
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-8 pt-6">

                    {/* --- SECTION 1: PERSONNEL & LOCATION --- */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#FAB435]">1. Site & Personnel</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Location/Site</Label>
                                <Input
                                    name="location"
                                    placeholder="Enter Location"
                                    className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Specific Patrol Area</Label>
                                <Input
                                    name="patrol_area"
                                    placeholder="e.g. Parking Lot, Warehouse"
                                    className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]"
                                    value={formData.patrol_area}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Dynamic Guards List */}
                        <div className="space-y-3 bg-gray-50 dark:bg-slate-800/30 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Guards Present on Site</Label>
                                <Button type="button" onClick={addGuard} variant="outline" size="sm" className="h-8 border-gray-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                    <Plus className="h-3 w-3 mr-1" /> Add Guard
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {guards.map((guard, index) => (
                                    <div key={index} className="flex gap-2 animate-in fade-in">
                                        <Input
                                            placeholder={`Guard ${index + 1} Name`}
                                            className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]"
                                            value={guard}
                                            onChange={(e) => updateGuard(index, e.target.value)}
                                        />
                                        {guards.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-12 w-12 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                                                onClick={() => removeGuard(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-slate-800" />

                    {/* --- SECTION 2: TIMING & OBSERVATIONS --- */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#FAB435]">2. Patrol Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Patrol Date</Label>
                                <Input
                                    type="date"
                                    name="patrol_date"
                                    className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus-visible:ring-[#FAB435] block w-full"
                                    value={formData.patrol_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Patrol Time</Label>
                                <Input
                                    type="time"
                                    name="patrol_time"
                                    className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus-visible:ring-[#FAB435] block w-full"
                                    value={formData.patrol_time}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">General Observation</Label>
                            <Input
                                name="observation"
                                placeholder="e.g. Area secure, all gates locked."
                                className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]"
                                value={formData.observation}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Essential Items Checklist */}
                        <div className="space-y-3">
                            <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Essential Items Present</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { key: 'logbook', label: 'Duty Logbook' },
                                    { key: 'radio', label: 'Two-way Radio' },
                                    { key: 'torchlight', label: 'Torchlight' },
                                    { key: 'metal_detector', label: 'Metal Detector' },
                                    { key: 'uniform_id', label: 'Proper Uniform/ID' },
                                ].map((item) => {
                                    const isActive = essentialItems[item.key as keyof typeof essentialItems];
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => toggleItem(item.key as keyof typeof essentialItems)}
                                            className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                                                isActive
                                                    ? "border-[#FAB435] bg-[#FAB435]/10 text-[#E89500] dark:bg-[#FAB435]/20 dark:text-[#FAB435]"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600"
                                            }`}
                                        >
                                            {isActive ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 opacity-50" />}
                                            {item.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-slate-800" />

                    {/* --- SECTION 3: INCIDENTS & EVIDENCE --- */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#FAB435]">3. Incidents & Evidence</h3>

                        <div className="space-y-2">
                            <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Was an incident found?</Label>
                            <Select
                                value={formData.incident_found}
                                onValueChange={(val) => handleSelectChange("incident_found", val)}
                            >
                                <SelectTrigger className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:ring-[#FAB435]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                                    <SelectItem value="false">No, site is secure</SelectItem>
                                    <SelectItem value="true">Yes, incident occurred</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.incident_found === "true" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Incident Description</Label>
                                <Textarea
                                    name="incident_description"
                                    placeholder="Briefly describe the incident found..."
                                    className="min-h-[100px] bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435] resize-y p-3"
                                    value={formData.incident_description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[#3A3A3A] dark:text-slate-200 font-medium">Upload Evidence</Label>
                            <div
                                className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900/50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500">
                                    <Paperclip className="h-6 w-6 mb-1" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Click to attach files</span>
                                    <span className="text-xs">Photos or Videos (JPG, MP4)</span>
                                </div>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 p-3 rounded-md border border-gray-100 dark:border-slate-700 shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <UploadCloud className="h-5 w-5 text-[#FAB435] shrink-0" />
                                                <div className="flex flex-col truncate">
                                                    <span className="text-sm font-medium text-[#3A3A3A] dark:text-slate-200 truncate">{file.name}</span>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-800 mt-8">
                        <Button
                            type="button"
                            variant="ghost"
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 font-medium px-6 h-12"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="bg-[#FAB435] hover:bg-[#d99820] text-white font-bold px-8 h-12 shadow-md"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Patrol Report"
                            )}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default CreatePatrolLog;