import React from 'react'
import ReactJson from 'react-json-view'
import Tabs from 'antd/lib/tabs'
import 'antd/lib/tabs/style/index.css'
import Tooltip from 'antd/lib/tooltip'
import 'antd/lib/tooltip/style/index.css'
import Drawer, { DrawerProps } from 'antd/lib/drawer'
import 'antd/lib/drawer/style/index.css'
import { InfoCircleTwoTone } from '@ant-design/icons'

import { RawNodeDatum } from './types'
import { diagnosisText } from './data/diagnosis'

import { decimalSIPrefix, toFixed } from './utlis'

interface DetailDrawerProps {
  data: RawNodeDatum
}

export const DetailDrawer: React.FC<DetailDrawerProps & DrawerProps> = ({
  data,
  ...props
}) => {
  return (
    data && (
      <Drawer
        title={data.name}
        placement="right"
        width={window.innerWidth * 0.35}
        closable={false}
        destroyOnClose={true}
        getContainer={false}
        style={{ position: 'absolute' }}
        {...props}
      >
        <Tabs defaultActiveKey="1" type="card" size="middle">
          <Tabs.TabPane tab="General" key="1" style={{ padding: '1rem' }}>
            <p>
              Duration{' '}
              <Tooltip title="The time taken by the parent operator includes the time taken by all children.">
                <InfoCircleTwoTone style={{ paddingRight: 5 }} />
              </Tooltip>
              : <span>{data.duration} </span>
            </p>

            <p>
              Actual Rows: <span>{data.actRows}</span>
            </p>
            <p>
              {/* Estimate Rows: <span>{toFixed(data.estRows, 0)}</span> */}
              Estimate Rows: <span>{toFixed(data.estRows, 0)}</span>
            </p>
            <p>
              Run at: <span>{data.storeType}</span>
            </p>
            {data.cost && (
              <p>
                Cost: <span>{data.cost}</span>
              </p>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Hardware Usage"
            key="2"
            style={{ padding: '1rem' }}
          >
            <p>
              Disk:{' '}
              <span>
                {decimalSIPrefix('deckbytes')(data.diskBytes, 2, null)}
              </span>
            </p>
            <p>
              Memory:{' '}
              <span>
                {decimalSIPrefix('deckbytes')(data.memoryBytes, 2, null)}
              </span>
            </p>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Advanced Information"
            key="3"
            style={{ padding: '1rem' }}
          >
            <p>
              Task Type: <span>{data.taskType}</span>
            </p>
            {data.labels.length > 0 && (
              <p>
                Labels:{' '}
                <span>
                  {data.labels.map((label, idx) => (
                    <>
                      {idx > 0 ? ',' : ''}
                      {label}
                    </>
                  ))}
                </span>
              </p>
            )}
            {data.operatorInfo && (
              <p>
                Operator Info: <span>{data.operatorInfo}</span>
              </p>
            )}
            {Object.keys(data.rootBasicExecInfo).length > 0 && (
              <div>
                Root Basic Exec Info:{' '}
                <ReactJson
                  src={data.rootBasicExecInfo}
                  enableClipboard={false}
                  displayObjectSize={false}
                  displayDataTypes={false}
                  name={false}
                  iconStyle="circle"
                />
              </div>
            )}
            {data.rootGroupExecInfo.length > 0 && (
              <div>
                Root Group Exec Info:{' '}
                <ReactJson
                  src={data.rootGroupExecInfo}
                  enableClipboard={false}
                  displayObjectSize={false}
                  displayDataTypes={false}
                  name={false}
                  iconStyle="circle"
                />
              </div>
            )}
            {Object.keys(data.copExecInfo).length > 0 && (
              <div>
                Coprocessor Exec Info:{' '}
                <ReactJson
                  src={data.copExecInfo}
                  enableClipboard={false}
                  displayObjectSize={false}
                  displayDataTypes={false}
                  name={false}
                  iconStyle="circle"
                />
              </div>
            )}
            {data.accessObjects.length > 0 && (
              <div>
                Access Object:
                <>
                  {data.accessObjects.map((obj, idx) => (
                    <ReactJson
                      key={idx}
                      src={obj}
                      enableClipboard={false}
                      displayObjectSize={false}
                      displayDataTypes={false}
                      name={false}
                      iconStyle="circle"
                    />
                  ))}
                </>
              </div>
            )}
          </Tabs.TabPane>
          {data.diagnosis.length > 0 && (
            <Tabs.TabPane tab="Diagnosis" key="4">
              <ol type="1">
                {data.diagnosis.map((d, idx) => (
                  <li key={idx} style={{ padding: '1rem 0' }}>
                    {diagnosisText[d]}
                  </li>
                ))}
              </ol>
            </Tabs.TabPane>
          )}
        </Tabs>
      </Drawer>
    )
  )
}
