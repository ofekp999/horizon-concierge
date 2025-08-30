import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Answers = {
  budgetPerPersonMin?: number;
  budgetPerPersonMax?: number;
  kosherRequired?: boolean;
  kosherLevel?: "any"|"kosher"|"mehadrin"|"halavi"|"basari"|"none";
  withKids?: boolean;
  withPets?: boolean;
  cuisines?: string[];
  atmosphere?: "quiet"|"lively";
  wantBar?: boolean | null;
  minRating?: number;
  city?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { answers, page = 0 } : { answers: Answers, page: number } = await req.json();

    let qb = supabase.from("restaurants").select("*");

    if (answers.city) qb = qb.eq("city", answers.city);
    if (answers.minRating != null) qb = qb.gte("rating", answers.minRating);
    if (answers.withKids != null) qb = qb.eq("kids_friendly", answers.withKids);
    if (answers.withPets != null) qb = qb.eq("pets_friendly", answers.withPets);
    if (answers.atmosphere) qb = qb.eq("atmosphere", answers.atmosphere);
    if (answers.cuisines?.length) qb = qb.overlaps("cuisines", answers.cuisines);
    if (answers.kosherRequired === true) qb = qb.neq("kosher_status", "none");

    const { data, error } = await qb.limit(300);
    if (error) throw error;

    const scored = (data || []).map((r:any) => {
      let score = 0;
      const min = answers.budgetPerPersonMin ?? 0;
      const max = answers.budgetPerPersonMax ?? 9999;
      const rmin = r.price_per_person_min ?? 0;
      const rmax = r.price_per_person_max ?? 9999;
      const overlaps = !(max < rmin || min > rmax);
      if (overlaps) score += 30;

      if (answers.kosherRequired) {
        if (answers.kosherLevel === "mehadrin" && r.kosher_status === "mehadrin") score += 15;
        else if (r.kosher_status && r.kosher_status !== "none") score += 12;
      }

      if (answers.cuisines?.length) {
        const inter = (r.cuisines || []).filter((c:string)=>answers.cuisines!.includes(c)).length;
        score += inter * 10;
      }

      if (answers.atmosphere && r.atmosphere === answers.atmosphere) score += 10;
      if (answers.wantBar === true && r.has_bar) score += 8;
      if (answers.wantBar === false && r.cafe_bistro) score += 8;

      if (r.rating) score += Math.max(Math.min((r.rating - 3.5) * 8, 20), 0);

      return { ...r, _score: score };
    })
    .sort((a:any,b:any)=> b._score - a._score || (b.rating ?? 0) - (a.rating ?? 0));

    const pageSize = 3;
    const start = page * pageSize;
    const results = scored.slice(start, start + pageSize);

    return NextResponse.json({ results, nextPage: page + 1 });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
