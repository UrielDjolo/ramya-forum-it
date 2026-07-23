import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const FETCH_LIMIT = 3000;

export default function useSiteVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("site_visits")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT);

    if (error) setError(error.message);
    else setVisits(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  useEffect(() => {
    const channel = supabase
      .channel("site_visits_inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_visits" },
        (payload) => {
          setVisits((prev) => [payload.new, ...prev].slice(0, FETCH_LIMIT));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const resetVisits = useCallback(async () => {
    const { error } = await supabase.from("site_visits").delete().not("id", "is", null);
    if (error) throw error;
    setVisits([]);
  }, []);

  return { visits, loading, error, refetch: fetchVisits, resetVisits };
}
