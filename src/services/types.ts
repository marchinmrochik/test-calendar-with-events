export interface Holiday {
    countries: null;
    countryCode: string | null;
    date: string | null;
    fixed: boolean;
    global: boolean;
    launchYear: string | null;
    localName: string | null;
    name: string | null;
    types: string[] | null;
}

export interface StateRequests {
    loading: boolean;
    error:  string | null;
}

export interface CountryCode {
    countryCode: string;
    name: string;
}

export interface Label {
    text: string;
    color: string;
}

export interface EventI {
    id: number;
    description: string | null;
    startDate: string;
    endDate: string;
    startTime: string | null;
    endTime: string | null;
    arrayDate: string[];
    label: Label[];
}
