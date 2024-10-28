'use server';
import {createClient} from 'lib/supabase/server';
import { cookies } from 'next/headers';

export const removeImageFromBucket = async (bucket: string, paths: string[]) => {
    try {
        const supabase = await createClient(cookies());
    
        const removed = await supabase.storage.from(bucket).remove(paths);
        
        return removed;
        
    } catch (error) {
        console.log(error);
    }

}