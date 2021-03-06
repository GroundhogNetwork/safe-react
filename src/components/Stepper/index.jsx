// @flow
import Stepper from '@material-ui/core/Stepper'
import FormStep from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import GnoForm from '~/components/forms/GnoForm'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import { history } from '~/store'
import Controls from './Controls'

export { default as Step } from './Step'

type Props = {
  steps: string[],
  onSubmit: (values: Object) => Promise<void>,
  children: React$Node,
  classes: Object,
  onReset?: () => void,
  initialValues?: Object,
  disabledWhenValidating?: boolean,
}

type State = {
  page: number,
  values: Object,
}

type PageProps = {
  children: Function,
  prepareNextInitialProps: (values: Object) => {},
}

const transitionProps = {
  timeout: {
    enter: 350,
    exit: 0,
  },
}

class GnoStepper extends React.PureComponent<Props, State> {
  static Page = ({ children }: PageProps) => children

  static FinishButton = ({
    component, to, title, ...props
  }) => (
    <Button component={component} to={to} variant="raised" color="primary" {...props}>
      {title}
    </Button>
  )
  constructor(props: Props) {
    super(props)

    this.state = {
      page: 0,
      values: props.initialValues || {},
    }
  }

  onReset = () => {
    const resetCallback = this.props.onReset
    if (resetCallback) {
      resetCallback()
    }
    this.setState(() => ({
      page: 0,
      values: this.props.initialValues || {},
    }))
  }

  getPageProps = (pages: React$Node): PageProps => React.Children.toArray(pages)[this.state.page].props

  getActivePageFrom = (pages: React$Node) => {
    const activePageProps = this.getPageProps(pages)
    const { children, ...props } = activePageProps

    return children({ ...props, updateInitialProps: this.updateInitialProps })
  }

  updateInitialProps = (initialValues) => {
    this.setState({ values: initialValues })
  }

  validate = (values: Object) => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  next = async (values: Object) => {
    const activePageProps = this.getPageProps(this.props.children)
    const { prepareNextInitialProps } = activePageProps

    let pageInitialProps
    if (prepareNextInitialProps) {
      pageInitialProps = await prepareNextInitialProps(values)
    }

    const finalValues = { ...values, ...pageInitialProps }
    this.setState(state => ({
      page: Math.min(state.page + 1, React.Children.count(this.props.children) - 1),
      values: finalValues,
    }))
  }

  previous = () => {
    const firstPage = this.state.page === 0

    if (firstPage) {
      return history.goBack()
    }

    return this.setState(state => ({
      page: Math.max(state.page - 1, 0),
    }))
  }

  handleSubmit = async (values: Object) => {
    const { children, onSubmit } = this.props
    const { page } = this.state
    const isLastPage = page === React.Children.count(children) - 1
    if (isLastPage) {
      return onSubmit(values)
    }

    return this.next(values)
  }

  isLastPage = page => page === this.props.steps.length - 1

  render() {
    const {
      steps, children, classes, disabledWhenValidating = false,
    } = this.props
    const { page, values } = this.state
    const activePage = this.getActivePageFrom(children)
    const lastPage = this.isLastPage(page)
    const penultimate = this.isLastPage(page + 1)

    return (
      <React.Fragment>
        <GnoForm
          onSubmit={this.handleSubmit}
          initialValues={values}
          validation={this.validate}
        >
          {(submitting: boolean, validating: boolean, ...rest: any) => {
            const disabled = disabledWhenValidating ? submitting || validating : submitting
            const controls = (
              <React.Fragment>
                <Hairline />
                <Controls
                  disabled={disabled}
                  onPrevious={this.previous}
                  firstPage={page === 0}
                  lastPage={lastPage}
                  penultimate={penultimate}
                />
              </React.Fragment>
            )

            return (
              <Stepper classes={{ root: classes.root }} activeStep={page} orientation="vertical">
                {steps.map(label => (
                  <FormStep key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent TransitionProps={transitionProps}>
                      {activePage(controls, ...rest)}
                    </StepContent>
                  </FormStep>
                ))}
              </Stepper>
            )
          }}
        </GnoForm>
      </React.Fragment>
    )
  }
}

const styles = {
  root: {
    flex: '1 1 auto',
    backgroundColor: 'transparent',
  },
}

export default withStyles(styles)(GnoStepper)
