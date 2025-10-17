import { useEffect, useRef, useState, useCallback } from "react";
import { http } from "../api/http";

let cachedDashboard = null;
let lastFetchedAt = 0;
let inFlightPromise = null;

export function useDashboardData(ttlMs = 30000) {
  const [data, setData] = useState(cachedDashboard);
  const [loading, setLoading] = useState(!cachedDashboard);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      if (!inFlightPromise) {
        inFlightPromise = http.get("/dashboard-data").then((res) => res.data);
      }
      const result = await inFlightPromise;
      if (isMounted.current) {
        cachedDashboard = result;
        lastFetchedAt = Date.now();
        setData(result);
        setLoading(false);
      }
    } catch (e) {
      if (isMounted.current) {
        setError(e);
        setLoading(false);
      }
    } finally {
      inFlightPromise = null;
    }
  }, []);

  useEffect(() => {
    const isStale = Date.now() - lastFetchedAt > ttlMs;
    if (!cachedDashboard || isStale) {
      fetchDashboard();
    } else {
      setData(cachedDashboard);
      setLoading(false);
    }
  }, [fetchDashboard, ttlMs]);

  const refetch = useCallback(() => {
    lastFetchedAt = 0;
    return fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch };
}
