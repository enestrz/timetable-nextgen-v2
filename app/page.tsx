import { Suspense } from "react";
import Loading from "./loading";
import Schedule from "./@schedule/page";

export default function Home() {
    return (
        <main className="flex flex-col sm:mx-auto p-2 items-center justify-center gap-5">
            <h1>Favorite Games List</h1>
            {/* Wrap the part of the app that the sortable list with SortableContext */}
            <Suspense fallback={<Loading />}>
                <Schedule />
            </Suspense>
        </main>
    );
}
