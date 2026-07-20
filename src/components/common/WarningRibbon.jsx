


export default function WarningRibbon(){

    return(

        <div className="bg-red-500/80 border-b border-white-100/60 text-white-700 text-md">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 py-2 flex flex-wrap gap-x-3 gap-y-1 justify-between items-center">
                <span>
                    This is currently the early beta build of the Application, a lot of the words, and word pronounciations may be incorrect | I am a one-man team responsible for development, audio, datasets, and implementations, please be patient. 
                </span>
            </div>
        </div>

    );
}