import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DaySchedule from "../../components/schedules/DaySchedule/DaySchedule";
import BreakSchedule from "../../components/schedules/BreakSchedule/BreakSchedule";
import { ScheduleRow } from "../../types";
import { useBreakAssignment } from "../../hooks/useBreakAssignment";

function Home() {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const { hasBreaks } = useBreakAssignment(schedule);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Kassaschema</h1>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <motion.div 
          className="flex-1 max-w-3xl"
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <DaySchedule schedule={schedule} setSchedule={setSchedule} />
        </motion.div>
        
        <AnimatePresence>
          {hasBreaks && (
            <motion.div
              className="flex-1 max-w-3xl"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
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