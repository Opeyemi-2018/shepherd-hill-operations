"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    MapPin,
    Calendar,
    Download,
    Loader2,
    ArrowLeft,
    Eye,
    FileText,
    X
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

// Interface matching the design structure + document field
interface SOPDetails {
    id: string;
    title: string;
    site: string;
    effective_date: string;
    procedure_steps: string[];
    responsibilities: string[];
    emergency_instructions: string[];
    document?: string | null; // Added document field
}

const SOPDetailsPage = () => {
    const { token } = useAuth();
    const params = useParams();
    const router = useRouter();

    const [data, setData] = useState<SOPDetails | null>(null);
    const [loading, setLoading] = useState(true);

    // --- DOCUMENT PREVIEW MODAL STATE ---
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch Data
    useEffect(() => {
        const fetchDetails = async () => {
            if (!token || !params.id) return;
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/operations/sop-generators/${params.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const result = await response.json();
                console.log(result);
                if (result.status) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [token, params.id]);

    // --- OPEN DOCUMENT PREVIEW ---
    const openPreview = (url: string | undefined | null) => {
        if (!url) {
            toast.error("No document available to view.");
            return;
        }

        // Extract just the file path
        let filePath = url;
        if (url.includes('storage/')) {
            filePath = url.split('storage/').pop() || url;
        }

        // Construct exact custom URL
        const customUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/app/public/${filePath}`;
        setPreviewUrl(customUrl);
        setIsPreviewModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#FAB435]" />
            </div>
        );
    }

    if (!data) return <div className="p-8">SOP details not found.</div>;

    // Reusable Top Info Card
    const InfoCard = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
        <Card className="border-none shadow-sm bg-white dark:bg-card">
            <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-[#FAB435]/10 p-3">
                    <Icon className="h-6 w-6 text-[#FAB435]" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-400">{label}</p>
                    <h3 className="text-lg font-bold text-[#3A3A3A] dark:text-white mt-1">
                        {value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );

    // Reusable List Section Card
    const ListCard = ({ title, items }: { title: string, items: string[] }) => (
        <Card className="border-none shadow-sm bg-white dark:bg-card h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-[#3A3A3A] dark:text-white">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800"
                        >
                            {item}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 italic">No items recorded.</p>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 mt-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="-ml-2 h-8 w-8 text-gray-500"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-[#3A3A3A] dark:text-white">
                            SOP Preview
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm ml-8">Shows SOP Preview.</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Document Button - Only shows if a document exists */}
                    {data.document && (
                        <Button
                            variant="outline"
                            className="gap-2 bg-blue-50 text-blue-600 border-none hover:bg-blue-100"
                            onClick={() => openPreview(data.document)}
                        >
                            <Eye className="h-4 w-4" />
                            View Document
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="gap-2 bg-[#FAB435]/10 text-[#E89500] border-none hover:bg-[#FAB435]/20"
                        onClick={() => toast.success("Downloading SOP...")}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* 1. Top Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                    label="SOP Title"
                    value={data.title}
                    icon={ShieldCheck}
                />
                <InfoCard
                    label="Site"
                    value={data.site}
                    icon={MapPin}
                />
                <InfoCard
                    label="Effective Date"
                    value={data.effective_date}
                    icon={Calendar}
                />
            </div>

            {/* 2. Detailed Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Procedure Steps */}
                <ListCard
                    title="Procedure Steps"
                    items={data.procedure_steps}
                />

                {/* Column 2: Responsibilities */}
                <ListCard
                    title="Responsibilities"
                    items={data.responsibilities}
                />

                {/* Column 3: Emergency Instructions */}
                <ListCard
                    title="Emergency Instructions"
                    items={data.emergency_instructions}
                />
            </div>

            {/* --- DOCUMENT PREVIEW DIALOG --- */}
            <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
                <DialogContent className="max-w-[80vw] h-[85vh] p-0 flex flex-col overflow-hidden bg-black/90 border-0">
                    <div className="flex justify-between items-center p-4 bg-black/50 text-white">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#FAB435]" />
                            Document Preview
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPreviewModalOpen(false)}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden p-4">
                        {previewUrl && (
                            // Determine how to display based on file extension
                            previewUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                                <object
                                    data={previewUrl}
                                    type="application/pdf"
                                    className="w-full h-full rounded bg-white"
                                >
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full rounded bg-white"
                                        title="PDF Document Viewer"
                                    />
                                </object>
                            ) : previewUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={previewUrl}
                                    alt="Document"
                                    className="max-w-full max-h-full object-contain rounded"
                                />
                            ) : (
                                // Fallback for Word Documents (.doc, .docx) or unknown types
                                <div className="text-white flex flex-col items-center gap-4 text-center">
                                    <FileText className="h-16 w-16 text-gray-400" />
                                    <p className="text-lg">This file type cannot be previewed directly in the browser.</p>
                                    <a
                                        href={previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FAB435] hover:text-[#E89500] font-medium underline px-4 py-2 bg-white/10 rounded"
                                    >
                                        Click here to download or open the file
                                    </a>
                                </div>
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SOPDetailsPage;