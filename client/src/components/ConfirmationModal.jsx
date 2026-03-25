import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ConfirmationModal({ 
    open, 
    onOpenChange, 
    title = "Confirm Action", 
    description = "Are you sure you want to proceed?", 
    onConfirm, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    loading = false,
    variant = "destructive" 
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white border-none rounded-3xl p-8 shadow-2xl">
                <DialogHeader className="space-y-4">
                    <div className={`mx-auto w-16 h-16 ${variant === 'destructive' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'} rounded-2xl flex items-center justify-center`}>
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div className="text-center space-y-2">
                        <DialogTitle className="text-2xl font-black tracking-tight">{title}</DialogTitle>
                        <DialogDescription className="text-[14px] font-medium px-4">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-8 flex gap-3 sm:justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)} 
                        disabled={loading}
                        className="h-12 px-8 text-[11px] font-bold uppercase tracking-widest border-border/60 hover:bg-secondary/50 rounded-2xl"
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        disabled={loading}
                        className={`h-12 px-10 text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 ${
                            variant === 'destructive' 
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                            : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                        }`}
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
