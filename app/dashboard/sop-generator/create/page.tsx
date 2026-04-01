"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Loader2, UploadCloud, FileText } from "lucide-react";
import { toast } from "sonner";

const CreateSOP = () => {
    const { token } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    // 1. Added document to the state (typed as File | null)
    const [formData, setFormData] = useState({
        sop_title: "",
        client_name: "",
        location: "",
        effective_date: "",
        document: null as File | null,
    });

    // Handle Text Inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Select Inputs
    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    // 2. Handle File Input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, document: e.target.files[0] });
        }
    };

    const handleSubmit = async () => {
        // 3. Added validation for the document
        if (!formData.sop_title || !formData.client_name || !formData.location || !formData.effective_date || !formData.document) {
            toast.error("Please fill in all required fields, including the document.");
            return;
        }

        setLoading(true);

        try {
            // 4. Use FormData to handle the file upload
            const submitData = new FormData();
            submitData.append("sop_title", formData.sop_title);
            submitData.append("client_name", formData.client_name);
            submitData.append("location", formData.location);
            submitData.append("effective_date", formData.effective_date);
            submitData.append("document", formData.document);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/sop-generators`, {
                method: "POST",
                headers: {
                    // DO NOT set "Content-Type": "application/json" or "multipart/form-data" here.
                    // The browser will automatically set the correct boundary for FormData.
                    Authorization: `Bearer ${token}`
                },
                body: submitData, // Pass the FormData object here
            });

            const result = await response.json();

            if (response.ok && result.status) {
                toast.success("SOP created successfully");
                router.push("/dashboard/sop-generator");
            } else {
                // If Laravel returns validation errors, show them
                if (result.errors) {
                    const firstError = Object.values(result.errors)[0] as string[];
                    toast.error(firstError[0] || "Validation failed");
                } else {
                    toast.error(result.message || "Failed to create SOP");
                }
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
                <h1 className="text-2xl font-bold text-[#3A3A3A] dark:text-white">
                    SOP Setup
                </h1>
                <p className="text-gray-500 text-sm">Create standard operating procedure</p>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-card">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-lg font-bold text-[#3A3A3A] dark:text-white">
                        SOP Basic Information
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">

                    {/* SOP Title */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">SOP Title</Label>
                        <Input
                            name="sop_title"
                            placeholder="Enter SOP Title"
                            className="h-12 bg-white"
                            value={formData.sop_title}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Client/Site Name */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">Client/Site Name</Label>
                        <Select
                            value={formData.client_name}
                            onValueChange={(val) => handleSelectChange("client_name", val)}
                        >
                            <SelectTrigger className="h-12 bg-white">
                                <SelectValue placeholder="Select Client/Site Name" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Dangote Refinery">Dangote Refinery</SelectItem>
                                <SelectItem value="Zenith Bank HQ">Zenith Bank HQ</SelectItem>
                                <SelectItem value="Shoprite Ikeja">Shoprite Ikeja</SelectItem>
                                <SelectItem value="MTN Office Lekki">MTN Office Lekki</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">Location</Label>
                        <Input
                            name="location"
                            placeholder="Enter Location"
                            className="h-12 bg-white"
                            value={formData.location}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Effective Date */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">Effective Date</Label>
                        <Input
                            type="date"
                            name="effective_date"
                            className="h-12 bg-white block w-full"
                            value={formData.effective_date}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* 5. Document Upload UI */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">SOP Document</Label>
                        <div className="relative border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors text-center cursor-pointer">
                            <Input
                                type="file"
                                name="document"
                                accept=".pdf,.doc,.docx" // Add acceptable file types
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                                {formData.document ? (
                                    <>
                                        <FileText className="h-8 w-8 text-[#FAB435]" />
                                        <p className="text-sm font-medium text-foreground truncate max-w-[250px]">
                                            {formData.document.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm font-medium text-foreground">Click or drag file to upload</p>
                                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            variant="ghost"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-6"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#FAB435]/20 hover:bg-[#FAB435]/30 text-[#E89500] font-medium px-6 border-none"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Create SOP"
                            )}
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default CreateSOP;