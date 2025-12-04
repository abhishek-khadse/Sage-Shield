import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SingleTrack from './tracks/TrackManage';

const TrackWrapper = () => {
    const { trackId } = useParams();
    const VALID_TRACK_IDS = ['web-security-track', 'blockchain-security-track'];

    if (!VALID_TRACK_IDS.includes(trackId)) {
        return <Navigate to="/courses" replace />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <SingleTrack />
        </motion.div>
    );
};

export default TrackWrapper;