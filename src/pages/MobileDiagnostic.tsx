import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { detectBrowser, testStorageCompatibility } from '@/utils/browser';
import { useSecureStorage } from '@/hooks/useSecureStorage';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertCircle, Smartphone, Globe, Database, Shield } from 'lucide-react';

const MobileDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { storeGuestToken, getGuestToken, clearGuestToken } = useSecureStorage();
  
  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    
    const browserInfo = detectBrowser();
    const storageTests = testStorageCompatibility();
    
    // Test Supabase connection
    let supabaseTest = false;
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      supabaseTest = !error && data !== null;
    } catch {
      supabaseTest = false;
    }

    // Test secure storage
    let storageTest = false;
    try {
      const testToken = 'test-token-12345';
      storeGuestToken(testToken);
      const retrieved = getGuestToken();
      storageTest = retrieved === testToken;
      clearGuestToken();
    } catch {
      storageTest = false;
    }

    // Test redirection capability
    let popupTest = false;
    try {
      const popup = window.open('', '_blank', 'width=1,height=1');
      if (popup) {
        popup.close();
        popupTest = true;
      }
    } catch {
      popupTest = false;
    }

    setDiagnostics({
      browser: browserInfo,
      storage: storageTests,
      supabase: supabaseTest,
      secureStorage: storageTest,
      popups: popupTest,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    
    setLoading(false);
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {status ? "OK" : "ERREUR"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container mx-auto container-padding text-center">
            <h1 className="text-display text-primary mb-8">Diagnostic Mobile</h1>
            <p>Analyse en cours...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-8">
            <h1 className="text-display text-primary mb-4">Diagnostic Mobile</h1>
            <p className="text-muted-foreground">
              Diagnostic des fonctionnalités pour les paiements mobiles
            </p>
            <Button onClick={runDiagnostics} className="mt-4">
              Relancer le diagnostic
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Browser Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Informations Navigateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(true)}
                    Safari
                  </span>
                  <Badge variant={diagnostics?.browser.isSafari ? "default" : "secondary"}>
                    {diagnostics?.browser.isSafari ? "Détecté" : "Non"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </span>
                  <Badge variant={diagnostics?.browser.isMobile ? "default" : "secondary"}>
                    {diagnostics?.browser.isMobile ? "Oui" : "Non"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(true)}
                    iOS
                  </span>
                  <Badge variant={diagnostics?.browser.isIOS ? "default" : "secondary"}>
                    {diagnostics?.browser.isIOS ? "Détecté" : "Non"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.browser.isSafariMobile)}
                    Safari Mobile
                  </span>
                  <Badge variant={diagnostics?.browser.isSafariMobile ? "destructive" : "default"}>
                    {diagnostics?.browser.isSafariMobile ? "Problématique" : "OK"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.popups)}
                    Support Popups
                  </span>
                  {getStatusBadge(diagnostics?.popups, "Popups")}
                </div>
              </CardContent>
            </Card>

            {/* Storage Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Tests de Stockage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.storage.localStorage)}
                    localStorage
                  </span>
                  {getStatusBadge(diagnostics?.storage.localStorage, "localStorage")}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.storage.sessionStorage)}
                    sessionStorage
                  </span>
                  {getStatusBadge(diagnostics?.storage.sessionStorage, "sessionStorage")}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.storage.cookies)}
                    Cookies
                  </span>
                  {getStatusBadge(diagnostics?.storage.cookies, "Cookies")}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.secureStorage)}
                    Stockage Sécurisé
                  </span>
                  {getStatusBadge(diagnostics?.secureStorage, "Secure Storage")}
                </div>
              </CardContent>
            </Card>

            {/* Connectivity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Connectivité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(diagnostics?.supabase)}
                    Supabase
                  </span>
                  {getStatusBadge(diagnostics?.supabase, "Supabase")}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {diagnostics?.browser.isSafariMobile && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800 font-medium">Safari Mobile détecté</p>
                    <p className="text-xs text-orange-600">
                      Les redirections automatiques peuvent échouer. Un bouton manuel sera affiché si nécessaire.
                    </p>
                  </div>
                )}
                
                {!diagnostics?.popups && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800 font-medium">Popups bloquées</p>
                    <p className="text-xs text-red-600">
                      Activez les popups pour ce site dans les paramètres du navigateur.
                    </p>
                  </div>
                )}
                
                {!diagnostics?.secureStorage && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 font-medium">Problème de stockage</p>
                    <p className="text-xs text-yellow-600">
                      Le stockage sécurisé pourrait ne pas fonctionner correctement.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Technical Details */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Détails Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>User Agent:</strong>
                  <code className="block mt-1 p-2 bg-muted rounded text-xs break-all">
                    {diagnostics?.userAgent}
                  </code>
                </div>
                <div>
                  <strong>Timestamp:</strong> {diagnostics?.timestamp}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MobileDiagnostic;