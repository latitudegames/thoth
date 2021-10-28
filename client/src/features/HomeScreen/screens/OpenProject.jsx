import { useNavigate } from 'react-router-dom'

import { useSpell } from '../../../contexts/SpellProvider'
import { useTabManager } from '../../../contexts/TabManagerProvider'
import Icon from '../../common/Icon/Icon'
import Panel from '../../common/Panel/Panel'
import css from '../homeScreen.module.css'
import thothBanner from '../version-banner-0.0.0beta.jpg'
import FileInput from '../components/FileInput'
import ProjectRow from '../components/ProjectRow'

const OpenProject = ({
  spells,
  setSelectedProject,
  selectedProject,
  loadFile,
}) => {
  const { tabs } = useTabManager()
  // TODO remove thoth version from spellprovider
  const { getThothVersion } = useSpell()
  const navigate = useNavigate()

  return (
    <Panel shadow unpadded>
      {tabs?.length < 1 && (
        <div
          className={css['version-banner']}
          style={{ backgroundImage: `url(${thothBanner})` }}
        >
          {getThothVersion()}
        </div>
      )}
      <div className={css['open-project-container']}>
        <h1 style={{ marginLeft: 'var(--small)' }}>Recent Projects</h1>

        <Panel
          style={{ width: 'var(--c62)', backgroundColor: 'var(--dark-1)' }}
          flexColumn
          gap={'var(--small)'}
          roundness="round"
          unpadded
        >
          {spells.map((spell, i) => {
            if (i > 1) return <></>
            return (
              <ProjectRow
                key={i}
                setSelectedProject={setSelectedProject}
                selectedProject={selectedProject}
                label={spell.name}
                onClick={() => {
                  setSelectedProject(spell.name)
                }}
              />
            )
          })}
          <ProjectRow
            key="more"
            label={'More...'}
            icon={'properties'}
            style={{ fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}
            onClick={() => {
              navigate('/home/all-projects')
            }}
          />
        </Panel>

        <div className={css['button-row']}>
          {tabs?.length > 0 && (
            <button
              onClick={() => {
                window.history.back()
              }}
            >
              cancel
            </button>
          )}
          {tabs?.length < 1 && (
            <button
              onClick={() => {
                navigate('/home/create-new')
              }}
            >
              <Icon name="add" style={{ marginRight: 'var(--extraSmall)' }} />
              Create new
            </button>
          )}
          <FileInput loadFile={loadFile} />
          <button className={!selectedProject ? 'disabled' : 'primary'}>
            OPEN
          </button>
        </div>
      </div>
    </Panel>
  )
}

export default OpenProject
