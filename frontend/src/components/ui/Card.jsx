import { useState } from "react"
import Avatar from "boring-avatars";
import { updateManager, deleteManager, addInterview} from "../../requests";
import { INTERVIEW_LENGTH_HOURS, INTERVIEW_LENGTH_MINUTES } from "../../constants";

import AddManager from "../forms/AddManager";
import InnerCard from "./InnerCard";
import AddInterview from "../forms/AddInterview";

export default function Card({data, allData}) {
    const {manager_id, manager_name, start_time, end_time, skills = [], interviews = []} = data;
    const parentData = {
        manager_id: manager_id,
        manager_name: manager_name,
    };
    const[edit, setEdit] = useState(false);
    const [shown, setShown] = useState(false);

    const checkSkills = (managerId, candidateSkills) => {
        const manager_skills = allData.filter((element) => element.manager_id === parseInt(managerId))[0]?.skills;
        const parsedSkills = manager_skills.map(p => p.skill_id);
        console.log(parsedSkills, candidateSkills);

        const matchingSkills = candidateSkills.filter(skill => parsedSkills.includes(parseInt(skill))).length;
    
        const percentageMatch = (matchingSkills / candidateSkills.length) * 100;

        if (percentageMatch >= 80) {
            return true;
        } else {
            alert(`Совпадение навыков менеджера и кандидата менее 80% (${percentageMatch.toFixed(2)}%), собеседование недоступно.`);
            return false;
        }
    }

    const checkTime = (managerId, newInterviewStartTime) => {
        const INTERVIEW_DURATION_MINUTES = INTERVIEW_LENGTH_HOURS * 60 + INTERVIEW_LENGTH_MINUTES;
        const manager = allData.find(manager => manager.manager_id === managerId);
        if (!manager) {
            alert("Менеджер с таким id не найден.");
            return false;
        }
    
        const [newHours, newMinutes] = newInterviewStartTime.split(":").map(Number);
        const newInterviewStartInMinutes = newHours * 60 + newMinutes;
        const newInterviewEndInMinutes = newInterviewStartInMinutes + INTERVIEW_DURATION_MINUTES;

        const [startWorkHours, startWorkMinutes] = manager.start_time.split(":").map(Number);
        const workStartInMinutes = startWorkHours * 60 + startWorkMinutes;

        const [endWorkHours, endWorkMinutes] = manager.end_time.split(":").map(Number);
        const workEndInMinutes = endWorkHours * 60 + endWorkMinutes;

        if (newInterviewStartInMinutes < workStartInMinutes || newInterviewEndInMinutes > workEndInMinutes) {
            alert("Собеседование выходит за рамки рабочего времени.");
            return false;
        }

        for (const interview of manager.interviews) {
            const [startHours, startMinutes] = interview.interview_start_time.split(":").map(Number);
            const interviewStartInMinutes = startHours * 60 + startMinutes;
            const interviewEndInMinutes = interviewStartInMinutes + INTERVIEW_DURATION_MINUTES;

            if (
                (newInterviewStartInMinutes >= interviewStartInMinutes && newInterviewStartInMinutes < interviewEndInMinutes) ||
                (newInterviewEndInMinutes > interviewStartInMinutes && newInterviewEndInMinutes <= interviewEndInMinutes) ||
                (newInterviewStartInMinutes <= interviewStartInMinutes && newInterviewEndInMinutes >= interviewEndInMinutes)
            ) {
                alert(`Данное собеседование пересекается с собеседованием ${interview.candidate_name}.`);
                return false;
            }
        }

        return true;
    }

    const canChangeWorkHours = (managerId, newStartTime, newEndTime) => {
        const manager = allData.find(manager => manager.manager_id === managerId);
        
        const [newStartHours, newStartMinutes] = newStartTime.split(":").map(Number);
        const newWorkStartInMinutes = newStartHours * 60 + newStartMinutes;
        
        const [newEndHours, newEndMinutes] = newEndTime.split(":").map(Number);
        const newWorkEndInMinutes = newEndHours * 60 + newEndMinutes;
    
        for (const interview of manager.interviews) {
            const [interviewStartHours, interviewStartMinutes] = interview.interview_start_time.split(":").map(Number);
            const interviewStartInMinutes = interviewStartHours * 60 + interviewStartMinutes;
    
            const interviewEndInMinutes = interviewStartInMinutes + INTERVIEW_LENGTH_HOURS * 60 + INTERVIEW_LENGTH_MINUTES;

            if (interviewStartInMinutes < newWorkStartInMinutes || interviewEndInMinutes > newWorkEndInMinutes) {
                alert(`Изменить рабочее время менеджера таким образом нельзя: запланировано собеседование с кандидатом "${interview.candidate_name}".`);
                return false;
            }
        }
    
        return true;
    };

    const handleDelete = async () => {
        if (window.confirm(`Подтвердить удаление менеджера ${manager_name}?`)) {
            const res = await deleteManager(manager_id);
            if(res){
                alert(res.message);
                window.location.reload();
            }
            
        }
    };

    return (
        <div className="card-block">
            {edit?(
                <AddManager setShown={setEdit} requestFunction={updateManager} initialData={data} canChangeWorkHours={canChangeWorkHours}/>
            ):(
                <>
                    <div className="card-block-title">
                        <div className="card-block-title-avatar">
                            <Avatar name={manager_name} variant="marble"/>
                        </div>
                        <h2 className="card-block-title-name">
                            {manager_name}
                        </h2>
                        <div>
                            <img src="/images/icon-edit.png" onClick={() => setEdit(true)} className="card-block-title-edit-button" alt="Изменить" />
                            <img src="/images/icon-remove.png" onClick={() => handleDelete()} className="card-block-title-delete-button" alt="Удалить" />
                        </div>
                    </div>
                    <div className="card-block-content">
                        <div className="card-block-content-left-part">
                            <span className="card-block-subtitle">
                                <h3>Рабочее время:</h3>
                                {start_time} - {end_time}
                            </span>
                            <div className="card-block-subitems">
                                <h3>Навыки:</h3>
                                <div className="card-block-subitems-list">
                                    {skills.map((element, index) => {
                                        return (
                                            <div key={index} className="card-block-subitems-list-item">
                                                {element.skill_name}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="card-block-content-right-part">
                            {interviews.length > 0?(
                                <>
                                    <h3>Собеседования:</h3>
                                    <div className="card-block-tasks-list">
                                        {interviews.map((element, index) => {
                                            return (
                                                <InnerCard key={index} data={element} parentData={parentData} allData={allData} checkSkills={checkSkills} checkTime={checkTime}/>
                                            )
                                        })}

                                    </div>
                                </>
                            ):(
                                <div className="card-block-tasks-title">У данного менеджера пока нет собеседований</div>
                            )}
                            {shown?(
                                <AddInterview setShown={setShown} parentData={parentData} requestFunction={addInterview} checkSkills={checkSkills} checkTime={checkTime}/>
                            ):(
                                <div className="buttons-block">
                                    <button className="unfiled-button card-block-title-add-button" onClick={() => setShown(true)}>Запланировать собеседование</button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}