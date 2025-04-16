import { motion, AnimatePresence } from "framer-motion";
import DaySchedule from "../../components/schedules/DaySchedule/DaySchedule";
import BreakSchedule from "../../components/schedules/BreakSchedule/BreakSchedule";
import { useBreakAssignment } from "../../hooks/useBreakAssignment";
import { usePersistentSchedule } from "../../hooks/usePersistentSchedule";
import { useScheduleSharing } from "../../hooks/useScheduleSharing";

function Home() {
  const { schedule, setSchedule } = usePersistentSchedule();
  const { hasBreaks, breaks } = useBreakAssignment(schedule);
  const { copied, generateLiveUrl, copyToClipboard } = useScheduleSharing({ 
    schedule, 
    breaks 
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Kassaschema</h1>
      
      {/* Share URL Bar */}
      <div className="bg-gray-100 p-3 rounded mb-6 flex items-center">
        <div className="mr-3 font-medium">Share Schedule:</div>
        <input 
          type="text" 
          value={generateLiveUrl()} 
          readOnly 
          className="flex-grow p-2 border rounded mr-2 text-sm overflow-hidden text-ellipsis"
        />
        <button 
          onClick={copyToClipboard} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      <div className={`flex flex-col md:flex-row gap-6 ${hasBreaks ? 'justify-start' : 'justify-center'}`}>
        <motion.div 
          className="flex-1 max-w-3xl"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <DaySchedule schedule={schedule} setSchedule={setSchedule} />
        </motion.div>
        
        <AnimatePresence initial={false} mode="wait">
          {hasBreaks && (
            <motion.div
              key="break-schedule"
              className="flex-1 max-w-3xl"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ 
                opacity: 0,
                x: 300,
                transition: {
                  opacity: { duration: 0.2 },
                  x: { duration: 0.3 }
                }
              }}
            >
              <BreakSchedule schedule={schedule} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Home;