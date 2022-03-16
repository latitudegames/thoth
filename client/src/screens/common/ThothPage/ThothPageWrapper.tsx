import ModalProvider from '../../../contexts/ModalProvider'
import TabBar from '../TabBar/TabBar'
import css from './pagewrapper.module.css'

const ThothPageWrapper = ({ tabs, activeTab, ...props }) => {
  return (
    <ModalProvider>
      <div className={css['wrapper']}>
        <TabBar tabs={tabs} activeTab={activeTab} />
        {props.children}
      </div>
    </ModalProvider>
  )
}
export default ThothPageWrapper
