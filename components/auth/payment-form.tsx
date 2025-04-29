"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterFormData } from "@/types/register";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Wallet,
  Landmark,
  Shield,
  Loader2,
  CreditCardIcon,
} from "lucide-react";
import {
  bankTransferSchema,
  cardPaymentSchema,
  paymentSchema,
} from "@/validators/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type FormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  initialData?: Partial<RegisterFormData>;
  onSubmit: (data: Partial<RegisterFormData>) => void;
  onBack: () => void;
}

export const PaymentForm = ({
  initialData,
  onSubmit,
  onBack,
}: PaymentFormProps) => {
  const [paymentType, setPaymentType] = useState<
    "card" | "paypal" | "bank" | "other"
  >("card");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  const [bankData, setBankData] = useState({
    accountName: "",
    iban: "",
    bic: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const planPrices = {
    free: "0,00 €",
    pro: "9,99 €/mois",
    enterprise: "29,99 €/mois",
  };

  const planFeatures = {
    free: ["Accès limité", "Fonctionnalités de base", "Support par email"],
    pro: [
      "Toutes les fonctionnalités gratuites",
      "Accès complet",
      "Support prioritaire",
    ],
    enterprise: [
      "Toutes les fonctionnalités Pro",
      "SLA garantie",
      "Gestionnaire de compte dédié",
    ],
  };

  const selectedPrice =
    planPrices[initialData?.plan as keyof typeof planPrices] || "Gratuit";
  const selectedFeatures =
    planFeatures[initialData?.plan as keyof typeof planFeatures] || [];

  const form = useForm<FormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: null,
    },
    mode: "onChange", // Validation en temps réel
  });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").substring(0, 16);
    } else if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})/, "$1/")
        .substring(0, 5);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setCardData({ ...cardData, [name]: formattedValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankData({ ...bankData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const getInputStyles = (fieldName: keyof FormData) => {
    const hasError = !!form.formState.errors[fieldName];
    const isTouched = form.formState.touchedFields[fieldName];
    const isValid = isTouched && !hasError;

    return cn(
      "flex items-center bg-background border rounded-md focus-within:ring-1 focus-within:ring-primary",
      hasError
        ? "border-destructive"
        : isValid
          ? "border-green-500"
          : "border-input"
    );
  };

  const getIconStyles = (fieldName: keyof FormData) => {
    const hasError = !!form.formState.errors[fieldName];
    const isTouched = form.formState.touchedFields[fieldName];
    const isValid = isTouched && !hasError;

    return cn(
      "h-5 w-5 ml-3 mr-2",
      hasError
        ? "text-destructive"
        : isValid
          ? "text-green-500"
          : "text-muted-foreground"
    );
  };

  if (initialData?.plan === "free") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan gratuit</CardTitle>
              <CardDescription>
                Vous avez choisi le plan gratuit. Aucun paiement n'est requis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 space-y-2">
                <h3 className="font-medium">Votre abonnement inclut :</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedFeatures.map((feature, index) => (
                    <li key={index} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Retour
            </Button>
            <Button type="submit">
              Terminer l'inscription
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Méthode de paiement</CardTitle>
            <CardDescription>
              Sélectionnez votre méthode de paiement pour le plan{" "}
              {initialData?.plan} ({selectedPrice})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="card"
              onValueChange={(value) => setPaymentType(value as any)}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="card">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Carte
                </TabsTrigger>
                <TabsTrigger value="paypal">
                  <Wallet className="w-4 h-4 mr-2" />
                  PayPal
                </TabsTrigger>
                <TabsTrigger value="bank">
                  <Landmark className="w-4 h-4 mr-2" />
                  Virement
                </TabsTrigger>
                <TabsTrigger value="other">
                  <Shield className="w-4 h-4 mr-2" />
                  Autre
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4">
                <div className="space-y-2">
                  {/* <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Numéro de carte
                        </FormLabel>
                        <FormControl>
                          <div className={getInputStyles("cardNumber")}>
                            <CreditCardIcon
                              className={getIconStyles("cardNumber")}
                            />
                            <Input
                              {...field}
                              placeholder="xxxx xxxx xxxx xxxx"
                              className="border-0 focus-visible:ring-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    className={cn(errors.cardNumber && "border-destructive")}
                  />
                  {errors.cardNumber && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.cardNumber}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Date d'expiration</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      className={cn(errors.expiryDate && "border-destructive")}
                    />
                    {errors.expiryDate && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.expiryDate}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">Code de sécurité</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      className={cn(errors.cvv && "border-destructive")}
                    />
                    {errors.cvv && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.cvv}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Nom sur la carte</Label>
                  <Input
                    id="nameOnCard"
                    name="nameOnCard"
                    value={cardData.nameOnCard}
                    onChange={handleCardChange}
                    placeholder="John Doe"
                    className={cn(errors.nameOnCard && "border-destructive")}
                  />
                  {errors.nameOnCard && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.nameOnCard}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Nom du titulaire</Label>
                  <Input
                    id="accountName"
                    name="accountName"
                    value={bankData.accountName}
                    onChange={handleBankChange}
                    placeholder="John Doe"
                    className={cn(errors.accountName && "border-destructive")}
                  />
                  {errors.accountName && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.accountName}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    name="iban"
                    value={bankData.iban}
                    onChange={handleBankChange}
                    placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                    className={cn(errors.iban && "border-destructive")}
                  />
                  {errors.iban && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.iban}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bic">BIC/SWIFT</Label>
                  <Input
                    id="bic"
                    name="bic"
                    value={bankData.bic}
                    onChange={handleBankChange}
                    placeholder="BNPAFRPP"
                    className={cn(errors.bic && "border-destructive")}
                  />
                  {errors.bic && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.bic}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="paypal">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Vous serez redirigé vers PayPal pour finaliser votre
                    paiement.
                  </p>
                  <Button type="button" variant="outline" className="w-full">
                    Payer avec PayPal
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="other">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Contactez-nous pour d'autres méthodes de paiement.
                  </p>
                  <Button type="button" variant="outline" className="w-full">
                    Nous contacter
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Retour
            </Button>
            <Button type="submit">
              Payer maintenant
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
