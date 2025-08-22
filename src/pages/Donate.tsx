import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Check, QrCode, Banknote, Info, CreditCard } from "lucide-react";

const Donate = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      
    }
  };

  const bankDetails = {
    accountName: "Race for Education Accessibilities for Every Child Limited",
    accountNumber: "701-502-029066",
    bankAddress: "ICBC Tower, 3 Garden Road, Central, Hong Kong",
    swiftCode: "UBHKHKHH",
    bankCode: "072",
  };

  const fpsDetails = {
    fpsId: "105102370",
    qrPath: "/qr-fps.jpeg", 
  };



  return (
    <div className="min-h-screen py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Donate to REACH</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your gift helps underserved kindergarteners in Hong Kong build strong English foundations. Thank you for supporting brighter futures.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Row: FPS and Credit Card/Alipay */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FPS / QR */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <QrCode className="w-6 h-6 text-primary" />
                    <span>Faster Payment System (FPS)</span>
                  </span>
                  <Badge className="bg-primary text-primary-foreground shadow-sm">Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">FPS ID</label>
                    <div className="flex gap-2">
                      <Input readOnly value={fpsDetails.fpsId} />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCopy("fpsId", fpsDetails.fpsId)}
                      >
                        {copiedKey === "fpsId" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use your banking app to send via FPS. Enter our FPS ID above, or scan the QR code.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center flex-1">
                    <div className="p-6 bg-muted/40 rounded-lg text-center border border-border/50">
                      <img src={fpsDetails.qrPath} alt="FPS QR Code" className="mx-auto max-h-[180px]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Card / Alipay */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-accent" />
                  <span>Credit Card / Alipay</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Secure Online Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      Make a secure donation using your credit card, debit card, or Alipay account.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      asChild 
                      className="w-full bg-gradient-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <a 
                        href="https://buy.stripe.com/aFa6oHarUgKC9qQfSI1RC00" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Donate via Stripe
                      </a>
                    </Button>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Stripe Powered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row: Bank Transfer */}
          <Card className="border-0 shadow-soft">
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
            <Banknote className="w-6 h-6 text-secondary" />
            <span>Bank Transfer</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
    
            <div>
                <label className="text-sm font-medium text-muted-foreground">Account Name</label>
                <div className="flex gap-2">
                <Input readOnly value={bankDetails.accountName} />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy("accountName", bankDetails.accountName)}
                >
                    {copiedKey === "accountName" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                <div className="flex gap-2">
                <Input readOnly value={bankDetails.accountNumber} />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy("accountNumber", bankDetails.accountNumber)}
                >
                    {copiedKey === "accountNumber" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                </div>
            </div>
            <div>
                <label className="text-sm font-medium text-muted-foreground">Bank Address</label>
                <div className="flex gap-2">
                <Input readOnly value={bankDetails.bankAddress} />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy("bankAddress", bankDetails.bankAddress)}
                >
                    {copiedKey === "bankAddress" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="text-sm font-medium text-muted-foreground">SWIFT Code</label>
                <div className="flex gap-2">
                    <Input readOnly value={bankDetails.swiftCode} />
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy("swiftCode", bankDetails.swiftCode)}
                    >
                    {copiedKey === "swiftCode" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                </div>
                <div>
                <label className="text-sm font-medium text-muted-foreground">Bank Code</label>
                <div className="flex gap-2">
                    <Input readOnly value={bankDetails.bankCode} />
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCopy("bankCode", bankDetails.bankCode)}
                    >
                    {copiedKey === "bankCode" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                </div>
            </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
            </div>
        </CardContent>
        </Card>
        </div>
        
        {/* Tax Exemption Notice */}
        <div className="mt-12 text-center">
          <div className="bg-muted/30 p-6 rounded-lg border-l-2 border-r-2 border-primary">
            <p className="text-sm text-muted-foreground mb-2">
              根據 《香港稅務條例》 第 88 條本香港註冊有限公司是已獲豁免的慈善機構。捐款港幣 $100 元或以上可申請免稅。
            </p>
            <p className="text-sm text-muted-foreground">
              Race for Education Accessibilities for Every Child Limited is a registered charity institution in Hong Kong which is exempt from tax under section 88 of the Hong Kong inland revenue ordinance. Donations of HK$100 or above are tax deductible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;