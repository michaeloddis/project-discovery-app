/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { faker } from '@faker-js/faker'
import { ColumnSort, SortingState } from '@tanstack/react-table'

export type VulnData = {
    name: string;
    cve: string;
    cwe: string;
    type: string
}

export type VulnRecord = {
  id: number
  vulnData: VulnData;
  risk: 'low' | 'medium' | 'high' | 'critical'
  assetsEffected: number
  status: 'create' | 'open'
  dateFound: Date
}

export type PersonApiResponse = {
    data: VulnRecord[]
     meta: {
        totalRowCount: number
    }
}

const range = (len: number) => {
    const arr = []
        for (let i = 0; i < len; i++) {
            arr.push(i)
        }
    return arr
}

const newVuln = (index: number): VulnRecord => {
    return {
        id: index + 1,
        vulnData: {
            name: 'Cisco Small Business RV Series - OS Command Injection',
            cve: 'CVE-2021-1472',
            cwe: 'CWE-287',
            type: 'Remote Code Execution'
        },
        assetsEffected: faker.datatype.number(40),
        dateFound: faker.datatype.datetime({ max: new Date().getTime() }),
        status: faker.helpers.shuffle<VulnRecord['status']>([
            'create',
            'open'
        ])[0]!,
        risk: faker.helpers.shuffle<VulnRecord['risk']>([
            'low',
            'medium',
            'high',
            'critical'
        ])[0]!,
    }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): VulnRecord[] => {
    const len = lens[depth]!
    
    return range(len).map((d): VulnRecord => {
            return {
                ...newVuln(d),
            }
        })
    }

    return makeDataLevel()
}

const data = makeData(1000)

//simulates a backend api
export const fetchData = (
    start: number,
    size: number,
    sorting: SortingState
) => {
    const dbData = [...data]
    if (sorting.length) {
        const sort = sorting[0] as ColumnSort
        const { id, desc } = sort as { id: keyof VulnRecord; desc: boolean }
        
        dbData.sort((a, b) => {
            if (desc) {
                return a[id] < b[id] ? 1 : -1
            }
            
            return a[id] > b[id] ? 1 : -1
        })
    }

    return {
        data: dbData.slice(start, start + size),
        meta: {
            totalRowCount: dbData.length,
        },
    }
}
