const URL = "http://localhost:5000";

export const fetchAllData = async (setData) => {
    try {
      const response = await fetch(`${URL}/managers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      let data = await response.json();

      data.forEach(manager => {
        manager.interviews.sort((a, b) => {
          return a.interview_start_time.localeCompare(b.interview_start_time);
        });
      });
      
      setData(data);
    } catch (error) {
      console.error('Ошибка при первичной загрузке данных:', error.message);
      alert('Ошибка при первичной загрузке данных: ' + error.message);
    }
  };

export const addManager = async (data) => {
  try {

    const response = await fetch(`${URL}/managers/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении менеджера');
    }

    alert('Менеджер добавлен');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении менеджера: ' + error.message);
  }
};

export const updateManager = async (data, id) => {
  try {

    const response = await fetch(`${URL}/managers/update/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных');
    }

    alert('Данные обновлены');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при обновлении данных: ' + error.message);
  }
};

export const deleteManager = async (id) => {
    try {
        const response = await fetch(`${URL}/managers/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении менеджера');
        }

        const result = await response.json();
        return result; 
    } catch (error) {
        console.error('Ошибка:', error.message);
        alert('Ошибка при удалении менеджера: ' + error.message);
    }
};

export const addSkill = async (data) => {
  try {

    const response = await fetch(`${URL}/skills/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении навыка');
    }

    alert('Навык добавлен');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении навыка: ' + error.message);
  }
};

export const addInterview = async (data) => {
  try {

    const response = await fetch(`${URL}/interviews/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении собеседования');
    }

    alert('Собеседование добавлено');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении собеседования: ' + error.message);
  }
};

export const deleteInterview = async (id) => {
  try {
      const response = await fetch(`${URL}/interviews/delete/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при удалении собеседования');
      }

      const result = await response.json();
      return result; 
  } catch (error) {
      console.error('Ошибка:', error.message);
      alert('Ошибка при удалении собеседования: ' + error.message);
  }
};

export const moveInterview = async (id, data) => {
  try {

    const response = await fetch(`${URL}/interviews/move/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при перенаправлении собеседования');
    }

    alert('Собеседование перенаправлено');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при перенаправлении собеседования: ' + error.message);
  }
};

export const getSkills = async (setData) => {
  try {
      const response = await fetch(`${URL}/skills`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении навыков');
      }

      const data = await response.json();
      setData(data)
  } catch (error) {
      console.error('Ошибка при загрузке навыков:', error.message);
      alert('Ошибка при загрузке навыков: ' + error.message);
  }
};