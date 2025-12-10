import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { securityMonitor, rateLimiter, isValidEmail } from '@/utils/security';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    displayName: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced security validation
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis"
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Format d'email invalide"
      });
      return;
    }

    // Rate limiting for authentication attempts
    const rateLimitKey = `auth_attempt_${formData.email}`;
    
    if (!rateLimiter.isAllowed(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      securityMonitor.logEvent({
        type: 'rate_limit',
        details: 'Authentication rate limit exceeded',
        metadata: { email: formData.email, action: isLogin ? 'login' : 'signup' }
      });
      
      toast({
        variant: "destructive",
        title: "Trop de tentatives",
        description: "Veuillez patienter avant de réessayer"
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        securityMonitor.logEvent({
          type: 'auth_attempt',
          details: 'Login attempt initiated',
          metadata: { email: formData.email, action: 'login' }
        });

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          securityMonitor.logEvent({
            type: 'auth_failure',
            details: 'Login failed',
            metadata: { email: formData.email, error: error.message }
          });

          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: "destructive",
              title: "Erreur de connexion",
              description: "Email ou mot de passe incorrect."
            });
          } else {
            toast({
              variant: "destructive",
              title: "Erreur de connexion",
              description: error.message
            });
          }
        } else {
          securityMonitor.logEvent({
            type: 'auth_success',
            details: 'Login successful',
            metadata: { email: formData.email }
          });

          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur ENDLESS !"
          });
          navigate('/');
        }
      } else {
        // Signup validation
        if (!formData.firstName || !formData.lastName) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Veuillez remplir tous les champs requis"
          });
          return;
        }

        securityMonitor.logEvent({
          type: 'auth_attempt',
          details: 'Signup attempt initiated',
          metadata: { email: formData.email, action: 'signup' }
        });

        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              display_name: formData.displayName
            }
          }
        });

        if (error) {
          securityMonitor.logEvent({
            type: 'auth_failure',
            details: 'Signup failed',
            metadata: { email: formData.email, error: error.message }
          });

          if (error.message.includes('User already registered')) {
            toast({
              variant: "destructive",
              title: "Compte existant",
              description: "Un compte existe déjà avec cet email. Connectez-vous plutôt."
            });
          } else {
            toast({
              variant: "destructive",
              title: "Erreur d'inscription",
              description: error.message
            });
          }
        } else {
          securityMonitor.logEvent({
            type: 'auth_success',
            details: 'Signup successful',
            metadata: { email: formData.email }
          });

          toast({
            title: "Inscription réussie",
            description: "Vérifiez votre email pour confirmer votre compte."
          });
          
          // Create profile after successful signup
          if (data.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                user_id: data.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                display_name: formData.displayName
              });

            if (profileError) {
              securityMonitor.logEvent({
                type: 'auth_failure',
                details: 'Profile creation failed',
                userId: data.user.id,
                metadata: { email: formData.email, error: profileError.message }
              });
              console.error('Error creating profile:', profileError);
            }
          }
        }
      }
    } catch (error) {
      securityMonitor.logEvent({
        type: 'security_alert',
        details: 'Unexpected auth error',
        metadata: { email: formData.email, error: String(error) }
      });

      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <CardTitle className="text-headline text-primary">
              {isLogin ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Connectez-vous à votre compte ENDLESS' 
                : 'Créez votre compte ENDLESS'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="Jean"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nom d'affichage</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Jean D."
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="jean@exemple.be"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 underline transition-colors"
              >
                {isLogin 
                  ? "Pas encore de compte ? S'inscrire" 
                  : 'Déjà un compte ? Se connecter'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;