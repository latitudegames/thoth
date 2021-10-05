import { createNode } from 'rete-context-menu-plugin/src/utils'

import { Editor, useEditor } from '../../../../contexts/EditorProvider'
import Select from '../../../common/Select/Select'
import css from './editorwindow.module.css'

const EditorWindow = ({ tab }) => {
  const { getNodes, getNodeMap, editor } = useEditor()

  const nodeList = getNodes()
  const nodeMap = getNodeMap()

  const handleNodeSelect = async e => {
    if (editor)
      editor.addNode(
        await createNode(nodeMap.get(e.value), {
          x: 0,
          y: 0,
        })
      )
  }

  const getNodeOptions = () => {
    const arr = []

    // Checks if a category already exists in the array and returns its address,
    // otherwise returns false, and the nodeList map below creates a category.
    const doesCategoryExist = (arr, category) => {
      let address = false
      if (arr.length === 0) return false
      arr.forEach((obj, index) => {
        if (obj.label === category) address = index
      })
      return address
    }

    //Categorize node list into respective categories
    if (nodeList)
      Object.keys(nodeList).map(item => {
        if (doesCategoryExist(arr, nodeList[item].category) !== false) {
          return arr[
            doesCategoryExist(arr, nodeList[item].category)
          ].options.push({
            label: nodeList[item].name,
            value: nodeList[item].name,
          })
        } else {
          return arr.push({
            label: nodeList[item].category,
            options: [
              { label: nodeList[item].name, value: nodeList[item].name },
            ],
          })
        }
      })
    return arr
  }

  const EditorToolbar = () => {
    return (
      <>
        <Select
          searchable
          nested
          placeholder={'add node...'}
          onChange={async e => {
            await handleNodeSelect(e)
          }}
          options={getNodeOptions()}
          style={{ width: '50%' }}
          value={null}
          focusKey="cmd+p, ctl+p"
        />
      </>
    )
  }

  return (
    <div className={css['editor-container']}>
      <div className={css['editor-toolbar']}>
        <EditorToolbar />
      </div>
      <Editor tab={tab} />
    </div>
  )
}

export default EditorWindow
