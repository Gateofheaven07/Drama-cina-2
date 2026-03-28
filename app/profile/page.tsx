'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setName(user.name);
    }
  }, [user, router]);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Nama tidak boleh kosong.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      await updateProfile(name);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil. Silakan coba lagi.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-background py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-xl w-full">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center sm:text-left">
            Pengaturan Profil
          </h1>

          {message && (
            <Alert 
              variant={message.type === 'error' ? 'destructive' : 'default'} 
              className={`mb-6 ${message.type === 'success' ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20' : ''}`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" color="#22c55e" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{message.type === 'success' ? 'Berhasil' : 'Error'}</AlertTitle>
              <AlertDescription className={message.type === 'success' ? 'text-green-600 dark:text-green-400' : ''}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border/50">
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent shrink-0">
                <User className="h-10 w-10 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-base mt-1">{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="bg-muted text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah saat ini.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
                <div className="flex gap-4">
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted text-foreground" : "bg-background"}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t border-border/50">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                      setMessage(null);
                    }}
                    disabled={isSaving}
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving || name === user.name}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Edit Profil
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
