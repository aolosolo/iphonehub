
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, app } from "@/lib/firebase";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const storage = getStorage(app);

type BannerFormValues = {
  mainBanner: FileList | null;
  subBanner1: FileList | null;
  subBanner2: FileList | null;
};

export default function BannersPage() {
  const { control, handleSubmit, watch, reset } = useForm<BannerFormValues>({
    defaultValues: {
      mainBanner: null,
      subBanner1: null,
      subBanner2: null,
    },
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentBanners, setCurrentBanners] = useState({
    main: "https://ipoint.ae/cdn/shop/files/New_iphone_14_pro_max_offer_banner.jpg?v=1743450038&width=2100",
    sub1: "https://ipoint.ae/cdn/shop/files/iPhone_16_pro_max_1.png?v=1740152531&width=430",
    sub2: "https://ipoint.ae/cdn/shop/files/iphone_13_pro_max_1.png?v=1740151679&width=430",
  });
  const [previews, setPreviews] = useState({
    mainBanner: "",
    subBanner1: "",
    subBanner2: "",
  });

  const mainBannerFile = watch("mainBanner");
  const subBanner1File = watch("subBanner1");
  const subBanner2File = watch("subBanner2");

  useEffect(() => {
    const fetchBanners = async () => {
      const docRef = doc(db, "siteContent", "banners");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.urls) {
          setCurrentBanners(data.urls);
        }
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (mainBannerFile && mainBannerFile.length > 0) {
      setPreviews(p => ({ ...p, mainBanner: URL.createObjectURL(mainBannerFile[0]) }));
    } else {
       setPreviews(p => ({ ...p, mainBanner: "" }));
    }
  }, [mainBannerFile]);

  useEffect(() => {
    if (subBanner1File && subBanner1File.length > 0) {
      setPreviews(p => ({ ...p, subBanner1: URL.createObjectURL(subBanner1File[0]) }));
    } else {
       setPreviews(p => ({ ...p, subBanner1: "" }));
    }
  }, [subBanner1File]);

    useEffect(() => {
    if (subBanner2File && subBanner2File.length > 0) {
      setPreviews(p => ({ ...p, subBanner2: URL.createObjectURL(subBanner2File[0]) }));
    } else {
       setPreviews(p => ({ ...p, subBanner2: "" }));
    }
  }, [subBanner2File]);


  const uploadImage = async (file: File, path: string) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const onSubmit = async (data: BannerFormValues) => {
    setLoading(true);
    try {
      let newUrls = { ...currentBanners };

      const mainUrl = data.mainBanner?.[0] ? await uploadImage(data.mainBanner[0], "banners/main.jpg") : null;
      if (mainUrl) newUrls.main = mainUrl;

      const sub1Url = data.subBanner1?.[0] ? await uploadImage(data.subBanner1[0], "banners/sub1.jpg") : null;
      if (sub1Url) newUrls.sub1 = sub1Url;

      const sub2Url = data.subBanner2?.[0] ? await uploadImage(data.subBanner2[0], "banners/sub2.jpg") : null;
      if (sub2Url) newUrls.sub2 = sub2Url;

      const docRef = doc(db, "siteContent", "banners");
      await setDoc(docRef, { urls: newUrls }, { merge: true });

      setCurrentBanners(newUrls);
      toast({
        title: "Success",
        description: "Banners updated successfully.",
      });
      reset();
    } catch (error) {
      console.error("Error updating banners:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banners.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">Manage Banners</h1>
      <Card>
        <CardHeader>
          <CardTitle>Homepage Hero Banners</CardTitle>
          <CardDescription>
            Upload new images for the banners on the homepage. Leave an input blank to keep the current image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Banner */}
                <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="mainBanner">Main Banner (Recommended: 1200x600)</Label>
                    <Image src={previews.mainBanner || currentBanners.main} alt="Main banner" width={800} height={400} className="rounded-md border aspect-video object-cover"/>
                    <Controller
                        name="mainBanner"
                        control={control}
                        render={({ field }) => <Input id="mainBanner" type="file" accept="image/*" onChange={e => field.onChange(e.target.files)} />}
                    />
                </div>
                {/* Sub Banners */}
                <div className="space-y-6">
                    <div className="space-y-2">
                         <Label htmlFor="subBanner1">Sub Banner 1 (Recommended: 600x400)</Label>
                        <Image src={previews.subBanner1 || currentBanners.sub1} alt="Sub banner 1" width={400} height={200} className="rounded-md border aspect-video object-cover"/>
                        <Controller
                            name="subBanner1"
                            control={control}
                            render={({ field }) => <Input id="subBanner1" type="file" accept="image/*" onChange={e => field.onChange(e.target.files)} />}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subBanner2">Sub Banner 2 (Recommended: 600x400)</Label>
                        <Image src={previews.subBanner2 || currentBanners.sub2} alt="Sub banner 2" width={400} height={200} className="rounded-md border aspect-video object-cover"/>
                         <Controller
                            name="subBanner2"
                            control={control}
                            render={({ field }) => <Input id="subBanner2" type="file" accept="image/*" onChange={e => field.onChange(e.target.files)} />}
                        />
                    </div>
                </div>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Banners
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
