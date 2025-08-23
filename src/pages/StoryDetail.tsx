import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addTailwindClassesToHtml } from "@/services/blogService";

type Story = {
  title: string;
  summary: string;
  bodyHtml: string;
  category: string;
  tags: string[];
  images: { url: string; alt?: string }[];
  readingMinutes: number;
  createdAt?: any;
  author?: string;
};

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, "stories", id));
      if (snap.exists()) setStory(snap.data() as Story);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!story) return <div className="p-6">Story not found.</div>;

  const hero = story.images?.[0]?.url;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        {hero ? (
          <img src={hero} alt={story.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-warm" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <Badge variant="secondary">{story.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">{story.title}</h1>
          <p className="opacity-90 mt-2">{story.summary}</p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {story.tags?.map((t) => (
            <Badge key={t} variant="outline">#{t}</Badge>
          ))}
          <Badge variant="outline">{story.readingMinutes} min read</Badge>
        </div>
          
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: addTailwindClassesToHtml(story.bodyHtml) }}
        />

        {/* Optional: gallery of the rest of images */}
        {story.images?.length > 1 && (
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {story.images.slice(1).map((img, i) => (
              <img key={i} src={img.url} alt={img.alt || story.title} className="w-full rounded-lg object-cover" />
            ))}
          </div>
        )}

        <div className="pt-8">
          <Link to="/blogs">
            <Button variant="ghost">← Back to Stories</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

