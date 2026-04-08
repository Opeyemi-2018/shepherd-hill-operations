"use client";

import { useState, useEffect } from "react";
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

interface Client {
    id: number | string;
    name: string;
}

const CreateSOP = () => {
    const { token } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);

    // 1. Added client_name back to the state
    const [formData, setFormData] = useState({
        sop_title: "",
        client_id: "",
        client_name: "",
        location: "",
        effective_date: "",
        document: null as File | null,
    });

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Custom handler to grab BOTH the ID and the Name when a client is selected
    const handleClientSelect = (selectedId: string) => {
        const selectedClient = clients.find(client => String(client.id) === selectedId);

        if (selectedClient) {
            setFormData({
                ...formData,
                client_id: String(selectedClient.id),
                client_name: selectedClient.name
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, document: e.target.files[0] });
        }
    };

    const handleSubmit = async () => {
        // Ensure client_name is also validated
        if (!formData.sop_title || !formData.client_id || !formData.client_name || !formData.location || !formData.effective_date || !formData.document) {
            toast.error("Please fill in all required fields, including the document.");
            return;
        }

        setLoading(true);

        try {
            const submitData = new FormData();
            submitData.append("sop_title", formData.sop_title);
            submitData.append("client_id", formData.client_id);
            submitData.append("client_name", formData.client_name); // 3. Pass client_name to the payload
            submitData.append("location", formData.location);
            submitData.append("effective_date", formData.effective_date);
            submitData.append("document", formData.document);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/operations/sop-generators`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: submitData,
            });

            const result = await response.json();

            if (response.ok && result.status) {
                toast.success("SOP created successfully");
                router.push("/dashboard/sop-generator");
            } else {
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

                    {/* Client/Site Name - Uses the new handleClientSelect */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">Client/Site Name</Label>
                        <Select
                            value={formData.client_id}
                            onValueChange={handleClientSelect}
                        >
                            <SelectTrigger className="h-12 bg-white">
                                <SelectValue placeholder="Select Client/Site Name" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.length > 0 ? (
                                    clients.map((client) => (
                                        <SelectItem key={client.id} value={String(client.id)}>
                                            {client.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>
                                        No clients found
                                    </SelectItem>
                                )}
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

                    {/* Document Upload UI */}
                    <div className="space-y-2">
                        <Label className="text-[#3A3A3A] font-medium">SOP Document</Label>
                        <div className="relative border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors text-center cursor-pointer">
                            <Input
                                type="file"
                                name="document"
                                accept=".pdf,.doc,.docx"
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