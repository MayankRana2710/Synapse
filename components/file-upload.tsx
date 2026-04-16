'use client'

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    // Image Preview (Circular for servers)
    if (value && fileType !== "pdf") {
        return (
            <div className="flex items-center justify-center w-full">
                <div className="relative h-24 w-24 rounded-full border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all">
                    <Image
                        fill
                        src={value}
                        alt="Upload"
                        className="rounded-full object-cover"
                    />
                    <button 
                        onClick={() => onChange("")}
                        className="bg-[#0a0a0a] backdrop-blur-xl border border-white/[0.1] text-white/[0.4] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 p-1.5 rounded-full absolute top-0 right-0 shadow-xl transition-all active:scale-90"
                        type="button"
                    >
                        <X strokeWidth={2} className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        )
    }

    // PDF Preview
    if (value && fileType === "pdf") {
        return(
            <div className="relative flex items-center p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.08] group transition-all">
                <div className="h-8 w-8 rounded-[8px] bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
                    <FileIcon strokeWidth={1.5} className="h-6 w-6 text-white/[0.4]"/>
                </div>
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 text-[13px] font-medium text-white/[0.5] hover:text-white transition-colors line-clamp-1 max-w-[200px]"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-[#0a0a0a] border border-white/[0.1] text-white/[0.3] hover:text-rose-400 p-1.5 rounded-full absolute -top-2.5 -right-2.5 shadow-xl transition-all"
                    type="button"
                >
                    <X strokeWidth={2} className="h-3 w-3" />
                </button>
            </div>
        )
    }

    // Dropzone
    return (
        <UploadDropzone
            className="min-h-[150px] border-2 border-dashed border-white/[0.1] rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:border-white/[0.3]"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].ufsUrl);
            }}
            onUploadError={(error: Error) => {
                console.log(error)
            }}
        />
    )
}