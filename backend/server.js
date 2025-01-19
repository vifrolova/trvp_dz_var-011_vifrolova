const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000; 

app.use(cors());
app.use(express.json()); 

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'hr_agency'
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Успешное подключение к базе данных');
});

// Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер готов к взаимодействию');
});

app.get('/managers', (req, res) => {
    const sql = `
        SELECT 
            m.manager_id,
            m.manager_name,
            m.start_time,
            m.end_time,
            s.skill_id,
            sk.skill_name,
            i.interview_id,
            i.candidate_name,
            i.start_time AS interview_start_time,
            iskill.skill_id AS interview_skill_id,
            isk.skill_name AS interview_skill_name
        FROM managers m
        LEFT JOIN manager_skills s ON m.manager_id = s.manager_id
        LEFT JOIN skills sk ON s.skill_id = sk.skill_id
        LEFT JOIN manager_interviews i ON m.manager_id = i.manager_id
        LEFT JOIN interview_skills iskill ON i.interview_id = iskill.interview_id
        LEFT JOIN skills isk ON iskill.skill_id = isk.skill_id
        ORDER BY m.manager_id, i.interview_id, iskill.skill_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        const managers = {};

        results.forEach(row => {
            const {
                manager_id, manager_name, start_time, end_time,
                skill_id, skill_name,
                interview_id, candidate_name, interview_start_time,
                interview_skill_id, interview_skill_name
            } = row;

            if (!managers[manager_id]) {
                managers[manager_id] = {
                    manager_id,
                    manager_name,
                    start_time,
                    end_time,
                    skills: [],
                    interviews: []
                };
            }

            if (skill_id && !managers[manager_id].skills.some(skill => skill.skill_id === skill_id)) {
                managers[manager_id].skills.push({
                    skill_id,
                    skill_name
                });
            }

            if (interview_id) {
                let interview = managers[manager_id].interviews.find(int => int.interview_id === interview_id);
                
                if (!interview) {
                    interview = {
                        interview_id,
                        candidate_name,
                        interview_start_time,
                        interview_skills: []
                    };
                    managers[manager_id].interviews.push(interview);
                }

                if (interview_skill_id && !interview.interview_skills.some(skill => skill.skill_id === interview_skill_id)) {
                    interview.interview_skills.push({
                        skill_id: interview_skill_id,
                        skill_name: interview_skill_name
                    });
                }
            }
        });

        const response = Object.values(managers);
        res.json(response);
    });
});

app.post('/managers/add', (req, res) => {
    const { manager_name, start_time, end_time, skills } = req.body;

    const addManagerSql = 'INSERT INTO managers (manager_name, start_time, end_time) VALUES (?, ?, ?)';
    db.query(addManagerSql, [manager_name, start_time, end_time], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении менеджера:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении менеджера', details: err });
        }

        const manager_id = result.insertId;

        const insertSkillsSql = 'INSERT INTO manager_skills (manager_id, skill_id) VALUES ?';
        const skillsValues = skills.map(skill_id => [manager_id, skill_id]);

        db.query(insertSkillsSql, [skillsValues], (err) => {
            if (err) {
                console.error('Ошибка при добавлении навыков менеджера:', err);
                return res.status(500).json({ error: 'Ошибка при добавлении навыков менеджера', details: err });
            }

            res.status(201).json({ message: 'Менеджер успешно добавлен', manager_id });
        });
    });
});

app.put('/managers/update/:manager_id', (req, res) => {
    const { manager_id } = req.params;
    const { manager_name, start_time, end_time, skills } = req.body;

    const updateManagerSql = 'UPDATE managers SET manager_name = ?, start_time = ?, end_time = ? WHERE manager_id = ?';
    db.query(updateManagerSql, [manager_name, start_time, end_time, manager_id], (err, result) => {
        if (err) {
            console.error('Ошибка при обновлении данных менеджера:', err);
            return res.status(500).json({ error: 'Ошибка при обновлении данных менеджера', details: err });
        }

        const deleteSkillsSql = 'DELETE FROM manager_skills WHERE manager_id = ?';
        db.query(deleteSkillsSql, [manager_id], (err) => {
            if (err) {
                console.error('Ошибка при удалении старых навыков менеджера:', err);
                return res.status(500).json({ error: 'Ошибка при удалении старых навыков менеджера', details: err });
            }

            const insertSkillsSql = 'INSERT INTO manager_skills (manager_id, skill_id) VALUES ?';
            const skillsValues = skills.map(skill_id => [manager_id, skill_id]);

            db.query(insertSkillsSql, [skillsValues], (err) => {
                if (err) {
                    console.error('Ошибка при добавлении новых навыков менеджера:', err);
                    return res.status(500).json({ error: 'Ошибка при добавлении новых навыков менеджера', details: err });
                }

                res.status(200).json({ message: 'Данные менеджера успешно обновлены' });
            });
        });
    });
});

app.delete('/managers/delete/:manager_id', (req, res) => {
    const { manager_id } = req.params;

    const deleteManagerSql = 'DELETE FROM managers WHERE manager_id = ?';

    db.query(deleteManagerSql, [manager_id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении менеджера:', err);
            return res.status(500).json({ error: 'Ошибка при удалении менеджера', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Менеджер с таким ID не найден' });
        }

        res.status(200).json({ message: 'Менеджер успешно удален' });
    });
});

app.get('/skills', (req, res) => {
    const sql = 'SELECT * FROM skills ORDER BY skill_id';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        res.json(results); 
    });
});

app.post('/skills/add', (req, res) => {
    const { skill_name } = req.body;

    if (!skill_name) {
        return res.status(400).json({ error: 'Необходимо указать название навыка' });
    }

    const addSkillSql = 'INSERT INTO skills (skill_name) VALUES (?)';

    db.query(addSkillSql, [skill_name], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении навыка:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении навыка', details: err });
        }

        res.status(201).json({ message: 'Навык успешно добавлен', skill_id: result.insertId });
    });
});

app.post('/interviews/add', (req, res) => {
    const { manager_id, candidate_name, start_time, skills } = req.body;

    if (!manager_id || !candidate_name || !start_time || !skills || skills.length === 0) {
        return res.status(400).json({ error: 'Необходимо указать все поля: manager_id, candidate_name, start_time, skills' });
    }

    const addInterviewSql = 'INSERT INTO manager_interviews (manager_id, candidate_name, start_time) VALUES (?, ?, ?)';
    db.query(addInterviewSql, [manager_id, candidate_name, start_time], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении интервью:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении интервью', details: err });
        }

        const interview_id = result.insertId;

        const addSkillsSql = 'INSERT INTO interview_skills (interview_id, skill_id) VALUES ?';
        const skillsValues = skills.map(skill_id => [interview_id, skill_id]);

        db.query(addSkillsSql, [skillsValues], (err) => {
            if (err) {
                console.error('Ошибка при добавлении навыков для интервью:', err);
                return res.status(500).json({ error: 'Ошибка при добавлении навыков для интервью', details: err });
            }

            res.status(201).json({ message: 'Интервью успешно добавлено', interview_id });
        });
    });
});

app.delete('/interviews/delete/:interview_id', (req, res) => {
    const { interview_id } = req.params;

    const deleteInterviewSql = 'DELETE FROM manager_interviews WHERE interview_id = ?';
    const deleteInterviewSkillsSql = 'DELETE FROM interview_skills WHERE interview_id = ?';

    db.query(deleteInterviewSkillsSql, [interview_id], (err) => {
        if (err) {
            console.error('Ошибка при удалении навыков для интервью:', err);
            return res.status(500).json({ error: 'Ошибка при удалении навыков для интервью', details: err });
        }

        db.query(deleteInterviewSql, [interview_id], (err) => {
            if (err) {
                console.error('Ошибка при удалении интервью:', err);
                return res.status(500).json({ error: 'Ошибка при удалении интервью', details: err });
            }

            res.status(200).json({ message: 'Интервью и связанные навыки успешно удалены' });
        });
    });
});

app.put('/interviews/move/:interview_id', (req, res) => {
    const { interview_id } = req.params;
    const { new_manager_id } = req.body;

    const transferInterviewSql = 'UPDATE manager_interviews SET manager_id = ? WHERE interview_id = ?';

    db.query(transferInterviewSql, [new_manager_id, interview_id], (err, result) => {
        if (err) {
            console.error('Ошибка при перенаправлении интервью:', err);
            return res.status(500).json({ error: 'Ошибка при перенаправлении интервью', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Интервью с указанным ID не найдено' });
        }

        res.status(200).json({ message: 'Интервью успешно перенаправлено другому менеджеру' });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});