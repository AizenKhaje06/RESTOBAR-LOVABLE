import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const login = useCallback(async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      const userData = {
        id: data.user.id,
        email: data.user.email,
        role: "admin", // pwede mo later i-dynamic
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  } finally {
    setIsLoading(false);
  }
}, []);
