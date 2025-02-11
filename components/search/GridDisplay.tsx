    import { Pagination } from '@nextui-org/react';
    import { useQueryClient } from '@tanstack/react-query';
    import React from 'react'

    type Props<T> = {
        orderedDocuments: { data: any | null, error: any | null },
       renderElement: (renderItem: T) => JSX.Element,
        userSearchParams:any,
        setUserSearchParams: (params: any) => void,
    queryKeyName:string,
    }

    function GridDisplay<T>({ orderedDocuments, renderElement, userSearchParams, setUserSearchParams, queryKeyName

    }: Props<T>) {
        
        const queryClient = useQueryClient();


    return (
    <div className={`flex w-full flex-col gap-6 p-2`}>
        <div className="grid mx-auto p-2 gap-4 w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {orderedDocuments && orderedDocuments.data && orderedDocuments.data.map(renderElement)}
        </div>

            <Pagination onChange={async (page) => {
            console.log(page);
            await queryClient.cancelQueries()

    // Remove all inactive queries that begin with `posts` in the key
                queryClient.removeQueries({
                    queryKey: [
                        queryKeyName
    ], type: 'inactive' })

    // Refetch all active queries
    await queryClient.refetchQueries({ type: 'active' })

    // Refetch all active queries that begin with `posts` in the key
                await queryClient.refetchQueries({
                    queryKey: [
                    queryKeyName
                    ], type: 'active'
                })
            setUserSearchParams({ ...userSearchParams, skip:page, });
            }} onRateChange={(e) => {
            console.log(e)
    }} classNames={{
    'wrapper':' self-center mx-auto w-full p-2',
    'cursor':"bg-primary-color",
    }} total={10} showControls loop color='primary' initialPage={1}  />
        </div>
    )
    }

    export default GridDisplay