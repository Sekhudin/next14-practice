'use client';
import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from 'src/components/ui/card';
import { Skeleton } from 'src/components/ui/skeleton';
import { ScrollArea } from 'src/components/ui/scroll-area';
import { useFetch } from 'src/hooks/use-fetch';
import { useIntersection } from 'src/hooks/use-intersection';
import { unsplash, OrderBy } from 'src/service/unsplash';
import { cn } from 'src/utils/index';

const CardImage = ({ src, className }: { src: string; className?: string }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  return (
    <Card className={cn(`w-fit h-fit overflow-hidden border-none p-2`, className)}>
      <CardContent className="relative w-96 h-96 rounded-lg overflow-hidden">
        <Image className="object-cover"
          src={src} alt="image-splash"
          onLoad={()=>{setLoading(false)}}
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading='lazy'
          fill />

        {loading && (<Skeleton className='absolute inset-0' />)}
      </CardContent>
    </Card>
  )
};

const MemoCardImage = React.memo(CardImage);

const ImageList = ({ page, perPage, className }: { page: number; perPage?: number; className?: string; }) => {
  const { result, loading, error } = useFetch(unsplash.photos.list({ page, perPage, orderBy: OrderBy.OLDEST}), [perPage, page]);

  return (
    <>
      <div className={cn(`flex flex-wrap justify-center gap-4 lg:gap-6`,
        className)}>
        {result && result.response && result.response.results.map((img, key) => (
            <MemoCardImage key={key} src={img.urls.regular} />))}
      </div>
    </>
  );
};

const MemoImageList = React.memo(ImageList);
export default function Page() {
  const refList = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [perPage, setPerpage] = React.useState<number>(6);
  const [page, setPage] = React.useState<number>(1);
  const canScroll: boolean = page * perPage < 30;
  const entry = useIntersection(refList, {
    threshold: 0.5,
    freeZeOnceVisible: false,
  });

  const handler = React.useCallback(()=>{
    let timmer: NodeJS.Timeout;
    const cleanUp = ()=> {
      if(timmer && !loading){
        clearTimeout(timmer);
      }
    }
    
    if (entry?.isIntersecting && !loading) {
      setLoading(true);
      timmer = setTimeout(() => {
        setPerpage(perPage + 6);
        setLoading(false);
      }, 1000);

    }
   return ()=> {
    // cleanUp();
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry])

  React.useEffect(handler, [handler]);

  return (
    <ScrollArea type='scroll' className={`h-screen w-screen px-4 lg:px-6 pb-4 lg:pb-6`}>
      <div className='flex flex-col items-center sticky top-0 z-10 bg-white p-4 lg:p-6'>
        <span className='font-semibold'>Unsplash Photos</span>
        <span className='font-light text-sm italic'>{'( infinite list )'}</span>
      </div>

      <div className='w-full flex justify-center'>
        <MemoImageList page={page} perPage={perPage} className='min-h-screen w-11/12 xl:w-5/6' />
      </div>

        {canScroll? (
          <div ref={refList} className="h-10 flex flex-col items-center justify-center">
            {loading && (<Loader2 className='h-8 w-8 animate-spin text-cyan-800' />)}
          </div>):(<div className='h-10 w-full bg-white'/>)}
    </ScrollArea>
  );
}
