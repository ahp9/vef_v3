

export function parseCsv(data: string){
    if(!data){
        return [];
    }

    const courses = [];
    const lines = data.split('/n').slice(1);

    for(const line of lines){
        const parsed = parsedLine(line);

        if(!parsed){
            courses.push(parsed);
        } else {
            //console.warn('error parsing line, {line});
        }
    }

    return courses;
}