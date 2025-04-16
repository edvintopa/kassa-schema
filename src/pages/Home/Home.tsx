import { useState } from "react";
import DaySchedule from "../../components/schedules/DaySchedule/DaySchedule";
import BreakSchedule from "../../components/schedules/BreakSchedule/BreakSchedule";
import { ScheduleRow } from "../../types";

function Home() {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Kassaschema</h1>
      <DaySchedule schedule={schedule} setSchedule={setSchedule} />
      {schedule.length > 0 && <BreakSchedule schedule={schedule} />}
    </div>
  );
}

export default Home;