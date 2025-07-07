import React, { useState } from 'react';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import questConfig from '../config/questConfig';

const { FiMessageSquare } = FiIcons;

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{ background: questConfig.PRIMARY_COLOR }}
        className="fixed top-1/2 -right-10 -translate-y-1/2 rotate-[270deg] flex items-center gap-2 px-3 py-2 text-white rounded-t-md rounded-b-none z-50 hover:right-[-8px] transition-all duration-300"
      >
        <div className="rotate-90">
          <SafeIcon icon={FiMessageSquare} className="text-lg" />
        </div>
        <span className="text-sm font-medium">Feedback</span>
      </button>

      {isOpen && (
        <FeedbackWorkflow
          uniqueUserId={questConfig.USER_ID}
          questId={questConfig.QUEST_FEEDBACK_QUESTID}
          isOpen={isOpen}
          accent={questConfig.PRIMARY_COLOR}
          onClose={() => setIsOpen(false)}
        >
          <FeedbackWorkflow.ThankYou />
        </FeedbackWorkflow>
      )}
    </>
  );
};

export default FeedbackButton;