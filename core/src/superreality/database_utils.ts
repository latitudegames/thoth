//Example usage: insertIfNotExists(con, "users", userId, 1, "user_id, user_name", "$1, $2", [1, 'test']);
export async function insertIfNotExists(
  con: any,
  table: string,
  id: string,
  idValue: string,
  values: string,
  valuesIds: string,
  data: any[]
) {
  const check = 'SELECT * FROM ' + table + ' WHERE ' + id + ' = $1'
  const cvalues = [idValue]

  const test = con.query(check, cvalues)
  if (test && test.rows && test.rows.length > 0) {
    return { data: 'exists' }
  } else {
    const query =
      'INSERT INTO ' + table + ' (' + values + ') VALUES (' + valuesIds + ')'

    const result = await con.query(query, data)
    return { data: result.rows }
  }
}

export async function insertOrEdit(
  con: any,
  table: string,
  id: string,
  idValue: string,
  values: string,
  valuesIds: string,
  data: any[],
  editValues: string
) {
  const check = 'SELECT * FROM ' + table + ' WHERE ' + id + ' = $1'
  const cvalues = [idValue]

  const test = con.query(check, cvalues)
  if (test && test.rows && test.rows.length > 0) {
    const query =
      'UPDATE ' +
      table +
      ' SET ' +
      editValues +
      ' WHERE id=$' +
      getLastId(editValues)
    const _data = data.concat(idValue)

    const result = await con.query(query, _data)
    return { data: result.rows }
  } else {
    const query =
      'INSERT INTO ' + table + ' (' + values + ') VALUES (' + valuesIds + ')'

    const result = await con.query(query, data)
    return { data: result.rows }
  }
}

//id=$1, test=$2
function getLastId(values: string): number {
  let lastId = 0
  for (let i = 0; i < values.length; i++) {
    try {
      const n = parseInt(values[i])
      lastId = n
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return lastId++
}
